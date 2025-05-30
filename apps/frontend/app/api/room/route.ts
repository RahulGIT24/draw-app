import { authOptions } from "@/app/lib/options";
import redis from "@repo/cache/cache";
import { CreateRoomSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    const data = await req.json();
    const parsedData = CreateRoomSchema.safeParse(data);

    if (parsedData.success === false) {
        return Response.json({ "message": parsedData.error.errors[0]?.message ?? "Invalid Input" }, { status: 400 })
    }
    const session = await getServerSession(authOptions);
    if (session === null || !session.user) {
        return Response.json({ "message": "Unauthorized Request" }, { status: 401 })
    }

    const userId = session.user.id;
    const key = `rooms-user-${userId}`

    await redis.del(key)
    try {
        const existingRooms = await client.room.findFirst({
            where: {
                adminid: Number(userId),
                slug: parsedData.data.slug.toLowerCase()
            }
        })

        if(existingRooms){
            return Response.json({ "message": "Room With Same Slug Exists" }, { status: 400 })
        }

        const room = await client.room.create({
            data: {
                adminid: Number(userId),
                slug: parsedData.data.slug.toLowerCase()
            }
        })
        return Response.json({ "message": "created", room }, { status: 201 })

    } catch (e: any) {
        console.log(e)
        throw new Error(e);
    }
}