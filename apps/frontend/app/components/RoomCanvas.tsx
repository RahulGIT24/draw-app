"use client";

import { HTTP_BACKEND, JOIN_ROOM, WS_URL } from "@repo/common/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Canvas from "./Canvas";
import { Button } from "@repo/ui/button";

export default function RoomCanvas() {

    const params = useParams()
    const router = useRouter()
    const [valid, setValid] = useState(false);
    const [errorMessage,setErrorMessage] = useState<string>("");
    const [isCollaborating,setIsCollaborating] = useState<boolean>(false);

    const ws_url = `${WS_URL}?token=${localStorage.getItem("token")}`;

    const [socket, setSocket] = useState<null | WebSocket>(null)

    useEffect(() => {
        const ws = new WebSocket(ws_url);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type:JOIN_ROOM,
                roomId:params.roomId as string
            }))
        }
    }, [])

    const [isAdmin,setIsAdmin] = useState(false);

    const validateRoom = async () => {
        if (!params.roomId) return;
        try {
            const res = await axios.get(`${HTTP_BACKEND}/room/${params.roomId}`, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            setIsCollaborating(res.data.room.collaboration);
            setValid(true);
            setIsAdmin(res.data.isAdmin)
        } catch (error: any) {
            setValid(false);
            if (error.response.status === 404) {
                toast.error("Invalid Room Id")
                router.push("/")
            }
            if (error.response.status === 401) {
                setErrorMessage(error.response.data.message)
                return;
            }
            // not authorized
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

    const goBack  = ()=>{
        router.push("/")
    }

    if (!socket) {
        return <div>Connecting to server</div>
    }
    return <>
    {
        valid ? 
        <Canvas isAdmin={isAdmin} roomId={params.roomId as string} socket={socket} isCollaborating={isCollaborating} setIsCollaborating={setIsCollaborating}/>
        :
        <div className="h-screen w-full flex justify-center flex-col gap-y-7 items-center bg-zinc-800 text-white font-bold text-3xl">
            <p>{errorMessage}</p>
            <Button text="Go Back" onClick={goBack}/>
        </div>
    }
    </>

}