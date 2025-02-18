"use client"

import { useEffect, useRef } from "react"
import { initDraw } from "../draw";

export default function Canvas({ roomId,socket }:{roomId:string,socket:WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (roomId) {
            initDraw(canvasRef, roomId,socket)
        }
    }, [canvasRef])

    return <canvas ref={canvasRef} width={2000} height={1000}>

    </canvas>
}