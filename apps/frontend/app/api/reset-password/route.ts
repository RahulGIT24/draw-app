import { client } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function POST(req:NextRequest,res:NextResponse){
    try {
        const body = await req.json();

        const password = body.password;
        const token = body.token;

        if(password.length < 8){
            return Response.json({
                message:"Password length can be min of 8 characters"
            },{status:400})
        }
        if(password.length > 20){
            return Response.json({
                message:"Password length can be max of 20 characters"
            },{status:400})
        }

        const user = await client.user.findFirst({
            where:{
                forgotPasswordToken:token
            },
            select:{
                forgotPasswordTokenExpiry:true,
                id:true
            }
        })

        if(!user || !user.forgotPasswordTokenExpiry){
            return Response.json({
                message:"User not found"
            },{status:404})
        }

        const maxExpiry = new Date();
        maxExpiry.setDate(maxExpiry.getDate()+10);

        if(maxExpiry>user.forgotPasswordTokenExpiry){
            await client.user.update({
                where:{
                    id:user.id
                },
                data:{
                    forgotPasswordToken:"",
                    forgotPasswordTokenExpiry:null
                }
            })
            return Response.json({
                message:"Token Expired"
            },{status:400})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await client.user.update({
            where:{
                id:user.id
            },
            data:{
                forgotPasswordToken:"",
                forgotPasswordTokenExpiry:null,
                password:hashedPassword
            }
        })

        return Response.json({
            message:"Password Updated"
        },{status:200})

    } catch (error) {
        return Response.json({
            message:"Internal Server Error"
        },{status:500})
    }
}