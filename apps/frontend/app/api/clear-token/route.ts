import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ 'message': "Not Authorized" }, { status: 403 })
        }

        const userId = Number(session.user.id);

        await client.user.update({
            where: {
                id: userId
            },
            data: {
                userToken: ""
            }
        })

        return Response.json({ 'message': "Token Revoked" }, { status: 200 })

    } catch (error) {
        return Response.json({ 'message': "Server Error" }, { status: 500 })
    }
}