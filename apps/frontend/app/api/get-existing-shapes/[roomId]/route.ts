import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import redis from "@repo/cache/cache"

export async function GET(req: Request, { params }: { params: { roomId: string } }) {
    const session = await getServerSession(authOptions);
    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id;
    const roomId = (await params).roomId;

    const key = `room:${roomId}:shapes`
    const cachedShapes = await redis.hvals(key);

    if (cachedShapes && cachedShapes.length > 0) {

        const parsedShapes = cachedShapes.map(shape => JSON.parse(shape));
        return Response.json({ shapes: parsedShapes }, { status: 200 });
    }
    try {
        const room = await client.room.findFirst({
            where: {
                id: Number(roomId)
            }
        })
        if (!room) {
            return Response.json({ "message": 'Room Not Exist' }, { status: 404 })
        }

        if (room.adminid !== Number(userId) && !room.collaboration) {
            return Response.json({ "message": "Unauthorized. You can't get shapes of this room" }, { status: 401 })
        }

        const shapes = await client.shape.findMany({
            where: {
                roomId: parseInt(roomId),
                isDeleted:false
            }
        })

        const key = `room:${roomId}:shapes`;

        const shapeMap: Record<string, string> = {};

        shapes.forEach(shape => {
            if (shape.id) {
                shapeMap[shape.id] = JSON.stringify(shape);
            }
        });

        if (Object.keys(shapeMap).length > 0) {
            await redis.hset(key, shapeMap);
            await redis.expire(key, 300);
        }


        return Response.json({ "shapes": shapes }, { status: 200 })

    } catch (error) {
        return Response.json({ "message": 'Internal Server Error' }, { status: 500 })
    }
}