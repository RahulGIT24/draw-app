import { authOptions } from "@/app/lib/options";
import { CreateShapeSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
    const session = await getServerSession(authOptions);

    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id;
    const roomId = (await params).roomId;

    try {
        const data = await req.json();
        console.log(data)
        const dataValid = CreateShapeSchema.safeParse(data);

        if(dataValid.success===false){
            return Response.json({ "message": "Invalid Data type" }, { status: 400 })
        }

        const roomExist = await client.room.findFirst({
            where: {
                id: Number(roomId)
            }
        })

        if (!roomExist) {
            return Response.json({ "message": 'Room Not Exist' }, { status: 404 })
        }

        if (roomExist.collaboration === false && roomExist.adminid !== Number(userId)) {

            return Response.json({ "message": "You can't add shapes in this room" }, { status: 401 })
        }

        let insertData = null;

        if (dataValid?.data?.type == 'rect') {
            insertData = {
                height: dataValid.data.height,
                type: dataValid.data.type,
                fillStyle: dataValid.data.fillStyle,
                strokeStyle: dataValid.data.strokeStyle,
                width: dataValid.data.width,
                x: dataValid.data.x,
                y: dataValid.data.y,
                roomId: Number(roomId),
                userId: Number(userId)
            }
        } else if (dataValid?.data?.type == 'circle') {
            insertData = {
                x: dataValid.data.centerX,
                type: dataValid.data.type,
                fillStyle: dataValid.data.fillStyle,
                strokeStyle: dataValid.data.strokeStyle,
                y: dataValid.data.centerY,
                roomId: Number(roomId),
                userId: Number(userId),
                radius: dataValid.data.radius
            }
        } 
        else if(dataValid?.data?.type === 'line'){
            insertData = {   
                x: dataValid.data.startX,
                y: dataValid.data.startY,
                type: dataValid.data.type,
                strokeStyle: dataValid.data.strokeStyle,
                endX: dataValid.data.endX,
                endY: dataValid.data.endY,
                roomId: Number(roomId),
                userId: Number(userId),
            }
        }else if(dataValid?.data.type === 'text'){
            insertData = {   
                x: dataValid.data.x,
                y: dataValid.data.y,
                type: dataValid.data.type,
                fillStyle: dataValid.data.fillStyle,
                width:dataValid.data.width,
                roomId: Number(roomId),
                userId: Number(userId),
                text:dataValid.data.text
            }   
        }

        if (!insertData) {  
            return Response.json({ "message": "Invalid Data to insert" }, { status: 400 })
        }

        const shape = await client.shape.create({
            data: insertData
        })

        return Response.json({ "message": "Shape Created", shape }, { status: 201 })
    } catch (error) {
        console.log(error);
        return Response.json({ "message": "Error while saving shapes" }, { status: 400 })
    }

}