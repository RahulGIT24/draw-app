"use client"

import { useEffect, useRef, useState } from "react"
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, UsersRoundIcon } from "lucide-react"
import { Game } from "../game/Game";
import CollaborateModal from "./CollaborateModal";

type Tools = "circle" | "rect" | "pencil"

export default function Canvas({ roomId, socket, isCollaborating, setIsCollaborating,isAdmin }: {
    roomId: string, socket: WebSocket, isCollaborating: boolean,isAdmin:boolean,
    setIsCollaborating: (b: boolean) => void
}) {
    const [windowW, setWindowW] = useState(window.innerWidth)
    const [windowH, setWindowH] = useState(window.innerHeight)
    const [collaborateModal, setCollaborateModal] = useState(false);

    const [game, setGame] = useState<Game>()

    const [selectedTool, setSelectedTool] = useState<Tools>("rect");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (game) {
            game.setShape(selectedTool);
        }
    }, [game, selectedTool])

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g)
            return () => {
                g.destroy()
            }
        }
    }, [canvasRef])

    return (
        <>
            {
                collaborateModal && <CollaborateModal isCollaborating={isCollaborating} setIsCollaborating={setIsCollaborating} roomId={roomId} setCollaborateModal={setCollaborateModal} />
            }
            <canvas ref={canvasRef} width={windowW} height={windowH} />
            <TopBar isAdmin={isAdmin} selectedTool={selectedTool} setSelectedTool={setSelectedTool} inCollaboration={isCollaborating} setCollaborateModal={setCollaborateModal} />
        </>
    );
}

function TopBar({ selectedTool, setSelectedTool, inCollaboration, setCollaborateModal, isAdmin }: {
    selectedTool: Tools,
    setSelectedTool: (t: Tools) => void,
    inCollaboration: boolean,
    setCollaborateModal: (b: boolean) => void,
    isAdmin: boolean
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10,
        width: '100vw'
    }}>
        <div className="flex justify-between w-full px-6">
            <div className="flex w-full">
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
            {
                isAdmin &&
                <div>
                    <IconButton icon={<UsersRoundIcon />} onClick={() => {
                        setCollaborateModal(true)
                    }} name="Circle" activated={inCollaboration} />
                </div>
            }
        </div>
    </div>
}