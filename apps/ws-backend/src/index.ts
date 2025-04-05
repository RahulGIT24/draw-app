import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { DRAW_SHAPE, ERASE, JOIN_ROOM, LEAVE_ROOM, SHAPE } from "@repo/common/config"
import { client } from "@repo/db/prisma"
import { JWT_SEC } from "@repo/backend-common/config";
import redis from "@repo/cache/cache"
import hash from "object-hash";

const PORT = 8000;

const wss = new WebSocketServer({ port: PORT });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users: User[] = []

function checkUser(token: string): string | null {
    try {
        if (!token) {
            return null
        }

        // validate the token by jwt.verify
        const decoded = jwt.verify(token, JWT_SEC)

        if (typeof decoded == "string") {
            return null
        }

        if (!decoded || !decoded.userId) {
            return null
        }

        return decoded.userId

    } catch (error) {
        return null
    }
}

wss.on('connection', (ws, request) => {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") as string;
    // const userId = checkUser(token)
    // if (!userId) {
    //     ws.close();
    //     return;
    // }

    ws.on('message', async (message: string) => {

        const data = JSON.parse(message);

        const type = data.type;

        if (type === SHAPE) {
            const shape = data.shape;
            const roomId = data.roomId

            const roomUsers = users.filter(user => user.rooms.includes(roomId));

            const key = `room:${roomId}:shapes`;
            const existingShapes = await redis.get(key);

            if (existingShapes) {
                const shapes = JSON.parse(existingShapes)
                shapes.push(shape)
                await redis.set(key, JSON.stringify(shapes), "EX", 300)
            } else {
                await redis.set(key, JSON.stringify(shape), "EX", 300)
            }

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

            const key = `room:${roomId}:shapes`
            const existingShapes = await redis.get(key);

            if (existingShapes) {
                console.log(existingShapes)
                console.log(shape)
                const newShapes = JSON.parse(existingShapes).filter((s: any) => {
                    if (shape.id && s.id) {
                        return (s?.id !== shape?.id)
                    } else {
                        return (hash(s) !== hash(shape))
                    }
                });
                await redis.set(key, JSON.stringify(newShapes), "EX", 300)
            }

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