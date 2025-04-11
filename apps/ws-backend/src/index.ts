import { WebSocket, WebSocketServer } from "ws";
import { DRAW_SHAPE, ERASE, JOIN_ROOM, LEAVE_ROOM, SHAPE } from "@repo/common/config"
import { client } from "@repo/db/prisma"
import redis from "@repo/cache/cache"
import { v4 as uuid } from 'uuid'

const PORT = 8000;

const wss = new WebSocketServer({ port: PORT });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: number
}

const users: User[] = []

async function checkUser(token: string): Promise<number | null> {
    try {
        const user = await client.user.findFirst({
            where:{
                userToken:token
            }
        })

        if(user){
            return user.id
        }

        return null;

    } catch (error) {
        return null
    }
}

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
            const roomUsers = users.filter(user => user.rooms.includes(roomId));
            const creator = users.filter(user => user.ws === ws)[0]

            const shape = data.shape;
            shape.id = uuid()
            shape.userId = Number(creator?.userId)
            shape.roomId = Number(roomId)


            const key = `room:${roomId}:shapes`;

            await redis.hset(key, {
                [shape.id]: JSON.stringify({ ...shape, isDeleted: false })
            });

            roomUsers.forEach(user => {
                if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
                    user.ws.send(JSON.stringify({
                        type: DRAW_SHAPE,
                        shape: shape
                    }))
                }
            })

        }

        if (type === JOIN_ROOM) {
            const roomId = data.roomId;

            if (!roomId) {
                return;
            }

            // check for room in db
            const room = await client.room.findFirst({
                where: {
                    id: Number(roomId)
                }
            })

            if (!room) {
                return;
            }

            const user = users.find(x => x.ws === ws);

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
            const shape = data.shape


            if (!roomId) {
                return;
            }

            const room = await client.room.findFirst({
                where: {
                    id: Number(roomId)
                }
            })


            if (!room) {
                return;
            }

            const roomUsers = users.filter(user => user.rooms.includes(roomId));
            roomUsers.forEach(user => {
                if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
                    user.ws.send(JSON.stringify({
                        type: ERASE,
                        shape: shape
                    }))
                }
            })

            let shapeToDel:any = await redis.hget(`room:${roomId}:shapes`, shape.id);

            if(shapeToDel){
                shapeToDel = JSON.parse(shapeToDel);
                shapeToDel.isDeleted = true;
                await redis.hset(`room:${roomId}:shapes`, shape.id, JSON.stringify(shapeToDel));
            }else{
                return;
            }

            // const key = `room:${roomId}:shapes`
            // const existingShapes = await redis.get(key);

            // if (existingShapes) {
            //     const newShapes = JSON.parse(existingShapes).filter((s: any) => {
            //         if (shape.id && s.id) {
            //             return (s?.id !== shape?.id)
            //         } else {
            //             return (hash(s) !== hash(shape))
            //         }
            //     });
            //     await redis.set(key, JSON.stringify(newShapes), "EX", 300)
            // }

            // try {
            //     await client.shape.delete({
            //         where: {
            //             id: shape.id
            //         }
            //     })
            // } catch (error) {
            //     return;
            // }
        }

    })
})