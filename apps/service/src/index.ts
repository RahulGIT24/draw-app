import { client } from '@repo/db/prisma';
import redis from '@repo/cache/cache';
import cron from 'node-cron';

async function syncShapesToDB() {
    try {
        const keys = await redis.keys('room:*:shapes');

        let allShapes: any[] = [];
        const deleteMap: Map<number, string[]> = new Map(); // roomId -> shapeIds to delete

        for (const key of keys) {
            const cachedShapes = await redis.hvals(key);
            const shapes: any[] = cachedShapes.map(str => JSON.parse(str));
            const roomId = Number(key.split(":")[1]);

            const toDelete: string[] = shapes
                .filter(shape => shape.isDeleted === true)
                .map(shape => shape.id);

            if (toDelete.length > 0) {
                deleteMap.set(roomId, toDelete);
            }

            shapes.forEach((shape: any) => {
                shape.roomId = roomId;
            });

            allShapes.push(...shapes);
        }

        if (allShapes.length > 0) {
            await client.shape.createMany({
                data: allShapes,
                skipDuplicates: true
            });
            console.log('✅ Shapes synced to DB');
        }

        for (const [roomId, shapeIds] of deleteMap.entries()) {
            await softDeleteShapes(shapeIds, roomId);
        }

    } catch (error) {
        console.error('❌ Error syncing shapes:', error);
    }
}

async function softDeleteShapes(shapeIds: string[], roomId: number) {
    try {
        await client.shape.updateMany({
            where: {
                roomId,
                id: { in: shapeIds }
            },
            data: { isDeleted: true }
        });
        console.log(`🗑️ Soft-deleted ${shapeIds.length} shapes in room ${roomId}`);
    } catch (error) {
        console.error('❌ Error in soft delete:', error);
    }
}

async function hardDeleteShapes(){
    try {
        await client.shape.deleteMany({
            where:{
                isDeleted:true
            }
        })
        console.log(`Hard Deleted Shapes`);
    } catch (error) {
        console.error('❌ Error in hard delete:', error);
    }
}

// Run every 1 minute
cron.schedule('* * * * *', async () => {
    console.log('⏰ Running shape sync cron...');
    await syncShapesToDB();
});

// 12hr
cron.schedule('0 */12 * * *', async () => {
    await hardDeleteShapes();
});