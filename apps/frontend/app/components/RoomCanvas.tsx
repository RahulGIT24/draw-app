"use client";

import { HTTP_BACKEND, JOIN_ROOM, WS_URL } from "@repo/common/config";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Canvas from "./Canvas";
import { Button } from "@repo/ui/button";

export default function RoomCanvas() {

    const params = useParams()
    const router = useRouter()
    const [valid, setValid] = useState(false);
    const [isCollaborating, setIsCollaborating] = useState<boolean>(false);
    const [collaborationToken,setCollaborationToken] = useState("")

    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    const ws_url = `${WS_URL}?token=${localStorage.getItem("token")}`;

    const [socket, setSocket] = useState<null | WebSocket>(null)

    useEffect(() => {
        const ws = new WebSocket(ws_url);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: JOIN_ROOM,
                roomId: params.roomId as string
            }))
        }
    }, [])

    const [isAdmin, setIsAdmin] = useState(false);

    const validateRoom = async () => {
        if (!params.roomId) return;
        try {
            let url = `/api/room/${params.roomId}`
            if(token){
                url += `?token=${token}`
            }
            const res = await axios.get(url, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            console.log(res);
            setIsCollaborating(res.data.room.collaboration);
            setCollaborationToken(res.data.room.collaborationToken);
            setValid(true);
            setIsAdmin(res.data.isAdmin)
        } catch (error: any) {
            setValid(false);
            if (error.response.status === 404) {
                toast.error("Invalid Room Id")
                router.push("/")
            }
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                router.push("/signin")
                toast.error('Session Expired')
            }
        }
    }

    useEffect(() => {
        validateRoom()
    }, [params])

    const goBack = () => {
        router.push("/")
    }

    if (!socket) {
        return <div>Connecting to server</div>
    }
    return <>
        {
            valid ?
                <Canvas isAdmin={isAdmin} roomId={params.roomId as string} socket={socket} isCollaborating={isCollaborating} setIsCollaborating={setIsCollaborating} collaborationToken={collaborationToken}/>
                :
                <div className="h-screen w-full flex justify-center flex-col gap-y-7 items-center bg-zinc-800 text-white font-bold text-3xl">
                    <p>Invalid Joining URL or Room Not Exists</p>
                    <Button text="Go Back" onClick={goBack} />
                </div>
        }
    </>

}