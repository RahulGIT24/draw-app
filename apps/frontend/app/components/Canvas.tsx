"use client"

import { useEffect, useRef, useState } from "react"
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react"
import { Game } from "../game/Game";

type Tools = "circle" | "rect" | "pencil"

export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const [windowW, setWindowW] = useState(window.innerWidth)
    const [windowH, setWindowH] = useState(window.innerHeight)

    const [game, setGame] = useState<Game>()

    const [selectedTool, setSelectedTool] = useState<Tools>("rect");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(game){
            game.setShape(selectedTool);
        }
    }, [game,selectedTool])

    useEffect(()=>{
        if(canvasRef.current){
            const g = new Game(canvasRef.current,roomId,socket)
            setGame(g)
            return ()=>{
                g.destroy()
            }
        }
    },[canvasRef])

    return (
        <>
            <canvas ref={canvasRef} width={windowW} height={windowH} />
            <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </>
    );
}

function TopBar({ selectedTool, setSelectedTool }: {
    selectedTool: Tools,
    setSelectedTool: (t: Tools) => void
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10
    }}>
        <div className="flex justify-center items-center">
            <IconButton icon={<Pencil />} onClick={() => {
                setSelectedTool("pencil")
            }} name="Line" activated={selectedTool === "pencil"} />
            <IconButton icon={<RectangleHorizontalIcon />} onClick={() => {
                setSelectedTool("rect")
            }} name="Rectangle" activated={selectedTool === "rect"} />
            <IconButton icon={<Circle />} onClick={() => {
                setSelectedTool("circle")
            }} name="Circle" activated={selectedTool === "circle"} />
        </div>
    </div>
}