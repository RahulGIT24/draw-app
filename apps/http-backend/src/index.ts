import express from "express"
import jwt from "jsonwebtoken"
import { EXPIRY, JWT_SEC } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { client } from "@repo/db/prisma"
import bcrypt from "bcrypt"
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/zod"
import cors from "cors"

const app = express();

app.use(express.json())
app.use(cors(
    {
        origin:"*"
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

app.listen(PORT, () => {
    console.log(`Http Backend Listening on ${PORT}`)
})