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
    const roomId = params.roomId;

    try {
        const data = await req.json();
        const dataValid = CreateShapeSchema.safeParse(data);

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

        if (!insertData) {
            return Response.json({ "message": "Invalid Data to insert" }, { status: 400 })
        }

        const shape = await client.shape.create({
            data: insertData
        })

        return Response.json({ "message": "Shape Created", shape }, { status: 201 })
        return;
    } catch (error) {

    }

}