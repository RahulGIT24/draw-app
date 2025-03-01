import { CreateUserSchema } from "@repo/common/zod";
import { client } from "@repo/db/prisma";
import bcrypt from "bcrypt"

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

        // put it in db
        const user = await client.user.create({
            data: dataValid.data
        })

        if (user) {
            return Response.json({
                "message":"Created",
                "data":{
                    "name":user.name,
                    "email":user.email,
                    "username":user.username
                }
            },{status:201})
        }


    } catch (error) {
        
    }
}