import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { client } from "@repo/db/prisma";

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return Response.json({
                message: "Token not found"
            }, { status: 403 })
        }

        const decoded: any = jwt.verify(token, 'rahul');

        const email = decoded.email;

        const user = await client.user.findFirst({
            where: {
                email,
                verificationToken: token
            }
        })

        if (!user) {
            return Response.json({
                message: "Invalid Token"
            }, { status: 403 })
        }

        await client.user.update({
            where: {
                email,
                verificationToken:token
            },
            data: {
                verificationToken: "",
                verified: true
            }
        })

        return Response.json({
            message: "You are verified"
        }, { status: 200 })

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return Response.json({
                message: "Token expired"
            }, { status: 400 })
        }
        return Response.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}