import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { JOIN_ROOM, JWT_SEC, LEAVE_ROOM } from "@repo/backend-common/config"
import { client } from "@repo/db/prisma"

const PORT = 8000;

const wss = new WebSocketServer({ port: PORT });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {

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
}

wss.on('connection', (ws, request) => {
    console.log("Client Connected");

    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") as string;
    const userId = checkUser(token)
    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on('message', async (message) => {
        if (typeof message != "string") {
            return
        }
        const data = JSON.parse(message);

        const type = data.type;

        if (type === JOIN_ROOM) {
            const roomId = data.roomId;

            if (!roomId) {
                return;
            }

            // check for room in db
            const room = await client.room.findFirst({
                where: {
                    id: roomId
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

    })
})