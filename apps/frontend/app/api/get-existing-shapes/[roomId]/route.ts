import { authOptions } from "@/app/lib/options";
import { client } from "@repo/db/prisma";
import { getServerSession } from "next-auth";

export async function GET(req:Request,{params}:{params:{roomId:string}}){
    const session  = await getServerSession(authOptions);
    if(session?.user == null){
        return Response.json({"message":'Unauthorized'},{status:401})
    }

    const userId = session.user.id;
    const roomId = (await params).roomId;

    try {
        const room = await client.room.findFirst({
            where:{
                id:Number(roomId)
            }
        })
        if(!room){
            return Response.json({"message":'Room Not Exist'},{status:404})
        }

        console.log('user id',userId)
        console.log('adminid',room.adminid)

        if(room.adminid!==Number(userId) && !room.collaboration){
            return Response.json({"message":"Unauthorized. You can't get shapes of this room"},{status:401})
        }

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

        return Response.json({"shapes":shapes},{status:200})

    } catch (error) {
        return Response.json({"message":'Internal Server Error'},{status:500})
    }
}