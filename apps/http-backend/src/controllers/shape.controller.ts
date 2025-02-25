import { CreateShapeSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import { Request, Response } from "express";

export const GetExistingShapes = async (req:Request, res:Response) => {
    try {
        const roomId = req.params.roomId;
        if (typeof roomId !== "string") {
            res.status(400).json({ "message": "Invalid Room Id" })
            return;
        }

        if (isNaN(parseInt(roomId))) {
            res.status(400).json({ "message": "Invalid Room Id" })
            return;
        }

        const room = await client.room.findFirst({
            where:{
                id:Number(roomId)
            }
        })

        if(!room){
            res.status(404).json({ "message": "Room Not Exist" })
            return;
        }

        if(room.adminid!==Number(req.userId) && !room.collaboration){
            res.status(401).json({ "message": "Unauthorized. You can't get shapes of this room" })
            return;
        }

        const shapes = await client.shape.findMany({
            where: {
                roomId: parseInt(roomId)
            },
            include: {
                room: {
                    select: {
                        id: true,
                        adminid: true,
                        slug: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            }
        })

        res.status(200).json({ "shapes": shapes })
        return;

    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
}

export const AddShapes = async (req:Request, res:Response) => {
    try {
        const roomId = req.params.roomId;
        console.log(req.body)

        const dataValid = CreateShapeSchema.safeParse(req.body);
        if (!dataValid.success) {
            res.status(400).json({ "message": dataValid.error.errors[0]?.message ?? "Invalid Input" })
            return;
        }

        const userId = Number(req.userId);

        if (isNaN(Number(roomId))) {
            res.status(400).json({ "message": "Invalid Room Id" });
            return;
        }

        const roomExist = await client.room.findFirst({
            where: {
                id: Number(roomId)
            }
        })

        if (!roomExist) {
            res.status(404).json({ "message": "Room Not Exist" });
            return;
        }

        if(roomExist.collaboration===false && roomExist.adminid !== userId){
            res.status(401).json({ "message": "You can't add shapes in this room" });
            return;
        }

        let insertData = null;
        if(dataValid.data.type=='rect'){
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
        }else if(dataValid.data.type=='circle'){
            insertData = {
                x: dataValid.data.centerX,
                type: dataValid.data.type,
                fillStyle: dataValid.data.fillStyle,
                strokeStyle: dataValid.data.strokeStyle,
                y: dataValid.data.centerY,
                roomId: Number(roomId),
                userId: Number(userId),
                radius:dataValid.data.radius
            }
        }

        if(!insertData){
            res.status(400).json({ "message": "Invalid Data to insert" })
            return;
        }

        const shape = await client.shape.create({
            data: insertData
        })

        res.status(200).json({ "message": "Shape Created", shape })
        return;
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
}