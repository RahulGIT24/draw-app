import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions);

    if (session === null) {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;

    if (!userId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const roomId = pathname.split('/').pop();
        const { searchParams } = new URL(req.url);

        const token = searchParams.get('token')

        if (isNaN(Number(roomId))) {
            return Response.json({ message: "Invalid Room Id" }, { status: 400 })
        }

        const whereCondition: {
            id: number,
            collaborationToken?: string,
            adminid?: number
        } = {
            id: Number(roomId)
        };

        if (typeof token == "string") {
            whereCondition.collaborationToken = token;
        } else {
            whereCondition.adminid = Number(userId);
        }

        const room = await client.room.findFirst({
            where: whereCondition,
        });

        if (!room) {
            return Response.json({ message: "Room not found" }, { status: 400 })
        }

        let isAdmin = room.adminid === Number(userId);

        return Response.json({ room, isAdmin }, { status: 200 })
    } catch (error) {
        return Response.json({ "error": "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session === null) {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id;

    if (!userId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const roomId = pathname.split('/').pop();
        const { collaboration } = await req.json();

        if (typeof collaboration !== "boolean") {
            return Response.json({ "error": "Invalid Collaboration type" }, { status: 400 })
        }

        const room = await client.room.findFirst({
            where: {
                id: Number(roomId),
                adminid: Number(userId)
            }
        })

        if (!room) {
            return Response.json({ "error": "Room Not Found" }, { status: 400 })
        }

        let token: string = "";

        if (collaboration) {
            token = uuidv4()
        }

        await client.room.update({
            where: {
                id: Number(roomId),
                adminid: Number(userId)
            },
            data: {
                collaboration: collaboration,
                collaborationToken: token
            }
        })

        return Response.json({ "message": `${collaboration ? "Collaboration Started" : "Collaboration Stopped"} `, token, collaboration }, { status: 200 })
    } catch (error) {
        return Response.json({ "message": "Internal Server Error" }, { status: 500 })
    }
}
