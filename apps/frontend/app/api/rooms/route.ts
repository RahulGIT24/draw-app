import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";

export async function GET(req:Request){

    const session = await getServerSession(authOptions);

    if(session==null){
        return Response.json({"message":"Unauthorized"},{status:401})
    }

    const userId = session.user.id;
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

        return Response.json({"rooms":rooms},{status:200})
    } catch (error) {
        return Response.json({"error":"Internal Server Error"},{status:500})
    }
}