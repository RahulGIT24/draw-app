import { client } from '@repo/db/prisma';
import redis from '@repo/cache/cache';
import cron from 'node-cron';

async function syncShapesToDB() {
    try {
        const keys = await redis.keys('room:*:shapes');

        for (const key of keys) {
            const cached = await redis.get(key);
            if (!cached) continue;

            const shapes = JSON.parse(cached);
            if (!Array.isArray(shapes)) continue;

            const shapeData = shapes.map((shape: any) => (
                shape
            ));
            // console.log(shapeData)

            if (shapeData.length > 0) {
                await client.shape.createMany({
                    data: shapeData,
                    skipDuplicates: true
                })
            }
        }

        console.log('✅ Shapes synced to DB');
    } catch (error) {
        console.error('❌ Error syncing shapes:', error);
    }
}

// Run every 1 minute
cron.schedule('* * * * *', async () => {
    console.log('⏰ Running shape sync cron...');
    await syncShapesToDB();
});

syncShapesToDB();