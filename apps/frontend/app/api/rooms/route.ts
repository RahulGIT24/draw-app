import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import redis from "@repo/cache/cache"

export async function GET(req:Request){

    const session = await getServerSession(authOptions);
    if(session==null){
        return Response.json({"message":"Unauthorized"},{status:401})
    }

    const userId = session.user.id;
    const key = `rooms-user-${userId}`

    const checkRoomsCache = await redis.get(key);

    if(checkRoomsCache){
        const rooms = JSON.parse(checkRoomsCache);
        return Response.json({"rooms":rooms},{status:200})
    }

    try {
        const rooms = await client.room.findMany({
            where: {
                adminid: Number(userId)
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        await redis.set(key,JSON.stringify(rooms))

        return Response.json({"rooms":rooms},{status:200})
    } catch (error) {
        return Response.json({"error":"Internal Server Error"},{status:500})
    }
}