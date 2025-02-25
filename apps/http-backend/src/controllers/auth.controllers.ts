import { JWT_SEC } from "@repo/backend-common/config";
import { CreateUserSchema, SignInSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express";


export const SignIn = async (req:Request, res:Response) => {
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
}

export const SignUp =  async (req:Request, res:Response) => {
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
}