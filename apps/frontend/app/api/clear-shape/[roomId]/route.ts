import { authOptions } from "@/app/lib/options";
// import {  deleteShapeFromRedis } from "@repo/common/function";
import { CreateShapeSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";

export async function PUT(req: Request, { params }: { params: { roomId: string } }) {
    const session = await getServerSession(authOptions);

    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 })
    }

    const userId = Number(session.user.id);
    const roomId = (await params).roomId;

    try {
        const data = await req.json();
        if(!data.id){
            return Response.json({ "message": "Shape id not found" }, { status: 400 })
        }
        const roomExist = await client.room.findFirst({
            where: {
                id: Number(roomId),
                adminid:userId
            }
        })

        if (!roomExist) {
            return Response.json({ "message": 'Room Not Exist' }, { status: 404 })
        }

        await deleteShapeFromRedis(roomId,data);
        
        return Response.json({ "message": "Shape Created" }, { status: 201 })
    } catch (error) {
        console.log(error);
        return Response.json({ "message": "Error while saving shapes" }, { status: 400 })
    }

}