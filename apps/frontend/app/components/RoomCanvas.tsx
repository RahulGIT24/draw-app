"use client";

import { HTTP_BACKEND, JOIN_ROOM, WS_URL } from "@repo/common/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Canvas from "./Canvas";

export default function RoomCanvas() {

    const params = useParams()
    const router = useRouter()
    const [valid, setValid] = useState(false);

    const ws_url = `${WS_URL}?token=${localStorage.getItem("token")}`;

    const [socket, setSocket] = useState<null | WebSocket>(null)

    useEffect(() => {
        if (valid) {
            const ws = new WebSocket(ws_url);
            ws.onopen = () => {
                setSocket(ws);
                ws.send(JSON.stringify({
                    type:JOIN_ROOM,
                    roomId:params.roomId as string
                }))
            }
        }
    }, [valid])

    const validateRoom = async () => {
        if (!params.roomId) return;
        try {
            const res = await axios.get(`${HTTP_BACKEND}/room/${params.roomId}`, {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
            setValid(true);
        } catch (error: any) {
            if (error.response.status === 404) {
                toast.error("Invalid Room Id")
                router.push("/")
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



    if (!socket) {
        return <div>Connecting to server</div>
    }
    return <>
        <Canvas roomId={params.roomId as string} socket={socket}/>
    </>

}