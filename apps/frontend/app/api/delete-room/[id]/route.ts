import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const url = new URL(req.url);
    const pathname = url.pathname;
    const roomId = pathname.split("/").pop();

    if(!roomId){
        return Response.json({ "message": 'Invalid Room Id' }, { status: 403 });
    }

    try {
        const deletedData = await client.room.deleteMany({
            where:{
                id:parseInt(roomId),
                adminid:userId
            }
        })

        if(deletedData.count<=0){
            return Response.json({"message":"Room Not Found"},{status:404})
        }

        return Response.json({"message":"Room Deleted"},{status:200})

    } catch (error) {
        return Response.json({ "message": 'Internal Server Error' }, { status: 500 });
    }
}