import { CreateRoomSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import { Request, Response } from "express";

export const CreateRoom = async (req: Request, res: Response) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (parsedData.success === false) {
        res.status(400).json({ "message": parsedData.error.errors[0]?.message ?? "Invalid Input" });
        return;
    }
    const userId = parseInt(req.userId);
    try {
        const room = await client.room.create({
            data: {
                adminid: userId,
                slug: parsedData.data.slug
            }
        })
        res.status(201).json({ "message": "created", room });
        return
    } catch (error) {
        res.status(411).json({ "message": "Room with same slug already exists" })
        return;
    }
}

export const GetRooms = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.userId);

        const rooms = await client.room.findMany({
            where: {
                adminid: userId
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

        res.status(200).json({ "rooms": rooms })
        return;
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
}

export const GetRoom = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;

        if (!roomId) {
            res.status(400).json({ message: "Please Provide Room Id" });
            return
        }

        if (isNaN(Number(roomId))) {
            res.status(400).json({ message: "Invalid Room Id" });
            return
        }

        const room = await client.room.findFirst({
            where: {
                id: Number(roomId), // Convert to number properly
            },
        });

        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return
        }

        if(room.adminid !== Number(req.userId) && room.collaboration === false){
            res.status(401).json({ message: "You can't collaborate in this room. Ask the admin to turn on collaboration" });
            return
        }

        let isAdmin = room.adminid === Number(req.userId);

        res.status(200).json({ room ,isAdmin});
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
}

export const UpdateRoom = async(req: Request, res: Response)=>{
    try {
        const {roomId} = req.params;
        const userId = req.userId;
        const {collaboration} = req.body;

        if(typeof collaboration !== "boolean"){
            res.status(400).json({ "message": "Invalid Collaboration type" })
            return;
        }

        if(!roomId){
            res.status(400).json({ "message": "Please Provide Room Id" })
            return;
        }

        const room = await client.room.findFirst({
            where:{
                id:Number(roomId),
                adminid:Number(userId)
            }
        })

        if(!room){
            res.status(401).json({ "message": "Unauthorized or room not exists" })
            return;
        }

        await client.room.update({
            where:{
                id:Number(roomId),
                adminid:Number(userId)
            },
            data:{
                collaboration:collaboration
            }
        })

        res.status(200).json({ "message": collaboration ? "Room Collaboration Started" : "Room Collaboration Stopped",collaboration })
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
}