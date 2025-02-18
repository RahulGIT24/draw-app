import express from "express"
import jwt from "jsonwebtoken"
import { EXPIRY, JWT_SEC } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { client } from "@repo/db/prisma"
import bcrypt from "bcrypt"
import { CreateRoomSchema, CreateShapeSchema, CreateUserSchema, SignInSchema } from "@repo/common/zod"
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors(
    {
        origin: "*"
    }
))

const PORT = 5000

app.get("/health-check", (req, res) => {
    res.send('Health Checked')
})

app.post("/signin", async (req, res) => {
    try {

        const data = req.body;

        const dataValid = SignInSchema.safeParse(data);

        if (!dataValid.success) {
            res.status(400).json({ "message": dataValid.error.errors[0]?.message ?? "Invalid Input" })
            return;
        }

        const checkUser = await client.user.findFirst({
            where: {
                OR: [
                    { username: dataValid.data.identifier },
                    { email: dataValid.data.identifier }
                ]
            },
            select: {
                id: true,
                password: true
            }
        })

        if (!checkUser) {
            res.status(400).json({ "message": "User not exist" })
            return;
        }

        const checkPassword = await bcrypt.compare(dataValid.data.password, checkUser.password);

        if (!checkPassword) {
            res.status(400).json({ "message": "invalid credentials" })
            return;
        }

        const userId = checkUser.id;

        // const jwtexpiry = EXPIRY;

        const token = jwt.sign({
            userId
        }, JWT_SEC, { expiresIn: "1h" })

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        console.log("Error", error);
    }
})

app.post("/signup", async (req, res) => {
    try {
        // validate
        const dataValid = CreateUserSchema.safeParse(req.body);

        if (dataValid.success === false) {
            res.status(400).json({ "message": dataValid.error?.errors[0]?.message ?? "Invalid Input" })
            return;
        }

        const checkUser = await client.user.findFirst({
            where: {
                OR: [
                    { username: dataValid.data.username },
                    { email: dataValid.data.email }
                ]
            },
            select: {
                id: true
            }
        })

        if (checkUser) {
            res.status(400).json({ "message": "Username or email already taken" })
            return;
        }

        const hashedPassword = await bcrypt.hash(dataValid.data.password, 10);

        dataValid.data.password = hashedPassword;

        // put it in db
        const user = await client.user.create({
            data: dataValid.data
        })

        if (user) {
            res.status(201).json({ "message": "created", "data": user })
        }

    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        console.log("Error", error);
    }
})

app.post("/room", middleware, async (req, res) => {
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
})

app.get("/rooms", middleware, async (req, res) => {
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
        const userId = parseInt(req.userId);


        const rooms = await client.room.findMany({
            where: {
                adminid: userId
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            }
        })
        res.status(200).json({ "rooms": rooms })
        return;
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
})
app.get("/rooms", middleware, async (req, res) => {
    try {
        const roomId = req.params.roomId;
        if (!roomId) {
            res.status(400).json({ "message": "Invalid Room Id" })
            return;
        }
        if (!isNaN(parseInt(roomId))) {
            res.status(400).json({ "message": "Invalid Room Id" })
            return;
        }
        const userId = parseInt(req.userId);


        const rooms = await client.room.findMany({
            where: {
                adminid: userId
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            }
        })
        res.status(200).json({ "rooms": rooms })
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
})
app.get("/room/:roomId", middleware, async (req, res) => {
    try {
        const roomId = req.params.roomId;

        if (!roomId) {
            res.status(400).json({ message: "Please Provide Room Id" });
            return
        }

        // ✅ Corrected validation check
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

        res.status(200).json({ room });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
});


app.get("/rooms", middleware, async (req, res) => {
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
        const userId = parseInt(req.userId);


        const rooms = await client.room.findMany({
            where: {
                adminid: userId
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            }
        })
        res.status(200).json({ "rooms": rooms })
        return;
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
})


app.get('/get-existing-shapes/:roomId', middleware, async (req, res) => {
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

        // are you part of that room
        // const userId = parseInt(req.userId);

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
})

app.post("/add-shapes/:roomId", middleware, async (req, res) => {
    try {
        const roomId = req.params.roomId;

        const dataValid = CreateShapeSchema.safeParse(req.body);
        if (!dataValid.success) {
            res.status(400).json({ "message": dataValid.error.errors[0]?.message ?? "Invalid Input" })
            return;
        }

        const userId = req.userId;

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

        const shape = await client.shape.create({
            data: {
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
        })

        res.status(200).json({ "message": "Shape Created", shape })
        return;
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" })
        return;
    }
})

app.listen(PORT, () => {
    console.log(`Http Backend Listening on ${PORT}`)
})