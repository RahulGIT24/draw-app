import { pushToEmailQueue } from "@repo/email-service/email";
import { SIGNUP } from "@repo/common/config";
import { CreateUserSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req:Request){
    try {
        const data = await req.json();

        const dataValid = CreateUserSchema.safeParse(data);

        if(!dataValid.success){
            return Response.json({
                "message":dataValid.error?.errors[0]?.message ?? "Invalid Input"
            },{status:400})
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
            return Response.json({
                "message":"Username or email already taken"
            },{status:400})
        }

        const hashedPassword = await bcrypt.hash(dataValid.data.password, 10);

        dataValid.data.password = hashedPassword;

        const token = jwt.sign({ email: dataValid.data.email,name:dataValid.data.name }, 'rahul', { expiresIn: '30d' })
        // put it in db
        const user = await client.user.create({
            data: {...dataValid.data,verificationToken:token}
        })

        if (user) {
            await pushToEmailQueue({subject:SIGNUP,token})
            return Response.json({
                "message":"Verfication Email Send. Please Verify Account",
            },{status:201})
        }

    } catch (error) {
        console.log(error)
        return Response.json({
            "message":"Can't Send Verfication Email"
        },{status:500})
    }
}