import { WebSocket, WebSocketServer } from "ws";
import { DRAW_SHAPE, ERASE, JOIN_ROOM, LEAVE_ROOM, SHAPE, FULL } from "@repo/common/config"
import { client } from "@repo/db/prisma"
import redis from "@repo/cache/cache"
import { createClient } from "redis";
import dotenv from 'dotenv'
import { checkUser } from "./utils";
dotenv.config()

const PORT = Number(process.env.SOCKET_PORT);

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: number
}

const users: User[] = []

const pub = createClient({
    url: process.env.REDIS_URL
})
const sub = createClient({
    url: process.env.REDIS_URL
})

pub.connect().then(() => console.log('Publisher Connected')).catch(e => console.log("Error while connecting to publisher",e))
sub.connect().then(() => {
    sub.subscribe('room-events', (message) => {
        const { type, roomId, shape, userId } = JSON.parse(message);
        const roomUsers = users.filter(user => user.rooms.includes(roomId));
        roomUsers.forEach(user => {
            if (userId !== user.userId && user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(JSON.stringify({ type, shape }));
            }
        })
    })
}).catch(e => console.log("Error while connecting to subscriber",e))

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws, request) => {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") as string;
    const userId = await checkUser(token)
    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        ws,
        rooms: [],
        userId: userId,
    });

    ws.on('message', async (message: string) => {

        const data = JSON.parse(message);

        const type = data.type;

        if (type === SHAPE) {
            const roomId = data.roomId
            const creator = users.find(user => user.ws === ws)

            if (!creator?.rooms.includes(roomId)) {
                return;
            }

            const shape = data.shape;
            shape.userId = Number(creator?.userId)
            shape.roomId = Number(roomId)

            const key = `room:${roomId}:shapes`;

            await redis.hset(key, {
                [shape.id]: JSON.stringify({ ...shape, isDeleted: false })
            });

            await pub.publish("room-events", JSON.stringify({
                type: DRAW_SHAPE,
                roomId,
                shape,userId:userId
            }));
        }

        if (type === JOIN_ROOM) {
            const roomId = data.roomId;
            if (!roomId) {
                return;
            }

            const roomUsers = users.filter(user => user.rooms.includes(roomId));
            if (roomUsers.length >= 10) {
                ws.send(JSON.stringify({ type: FULL, messae: `Room is Full` }))
                return;
            }
            const user = users.find(x => x.ws === ws);
            if (user?.rooms && user?.rooms?.length >= 10) {
                ws.send(JSON.stringify({ type: FULL, messae: `You are already in 10 rooms` }))
                return;
            }

            if (roomUsers.length === 0) {
                const room = await client.room.findFirst({
                    where: {
                        id: Number(roomId)
                    }
                })

                if (!room) {
                    return;
                }
            }

            if (!user) return;

            user.rooms.push(roomId);
        }

        if (type === LEAVE_ROOM) {
            const roomId = data.roomId;

            if (!roomId) {
                return;
            }

            const user = users.find(x => x.ws === ws);
            if (!user) return;
            user.rooms = user?.rooms.filter(x => x == roomId);
        }

        if (type == ERASE) {
            const roomId = data.roomId;

            const creator = users.find(user => user.ws === ws)

            if (!creator?.rooms.includes(roomId)) {
                return;
            }

            const shape = data.shape

            if (!roomId) {
                return;
            }

            const roomUsers = users.filter(user => user.rooms.includes(roomId));

            if (roomUsers.length === 0) {
                const room = await client.room.findFirst({
                    where: {
                        id: Number(roomId)
                    }
                })

                if (!room) {
                    return;
                }
            }

            await pub.publish("room-events", JSON.stringify({
                type: ERASE,
                roomId,
                shape,userId
            }));
            let shapeToDel: any = await redis.hget(`room:${roomId}:shapes`, shape.id);

            if (shapeToDel) {
                shapeToDel = JSON.parse(shapeToDel);
                shapeToDel.isDeleted = true;
                await redis.hset(`room:${roomId}:shapes`, shape.id, JSON.stringify(shapeToDel));
            } else {
                return;
            }
        }

    })
    ws.on('close', () => {
        const index = users.findIndex(user => user.ws === ws);
        if (index !== -1) {
            users.splice(index, 1);
        }
    });
})