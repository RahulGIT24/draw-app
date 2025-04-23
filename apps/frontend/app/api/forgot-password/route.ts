import { client } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { FORGOTPASSWORD } from "@repo/common/config";
import { pushToEmailQueue } from "@repo/email-service/email";

export async function POST(req:NextRequest,res:NextResponse) {
    try {
        const body  = await req.json();

        const identifier = body.identifier;

        const user = await client.user.findFirst({
            where:{
                OR:[
                    {email:identifier},
                    {username:identifier}
                ]
            },
            select:{
                id:true,
                email:true,
                name:true
            }
        })
        if(!user){
            return Response.json({
                message:"User not Found"
            },{status:404})
        }

        const token = jwt.sign({email:user.email,name:user.name},'rahul');

        const tenDays = new Date();
        tenDays.setDate(tenDays.getDate()+10);

        const update = await client.user.update({
            where:{
                id:user.id
            },
            data:{
                forgotPasswordToken:token,
                forgotPasswordTokenExpiry:tenDays
            }
        })
        console.log(update)

        const res = await pushToEmailQueue({subject:FORGOTPASSWORD,token})

        if(res==true){
            return Response.json({
                message:"Verfication Email Sent"
            },{status:200})
        }else{
            return Response.json({
                message:"Unable to Send Verification Email"
            },{status:400})
        }

    } catch (error) {
        return Response.json({
            message:"Internal Server Error"
        },{status:500})
    }
}