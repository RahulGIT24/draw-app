import { authOptions } from "@/app/lib/options";
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
    try {

        const room = await client.room.create({
            data: {
                adminid: Number(userId),
                slug: parsedData.data.slug
            }
        })
        return Response.json({ "message": "created", room }, { status: 201 })

    } catch (e: any) {
        throw new Error(e);
    }
}