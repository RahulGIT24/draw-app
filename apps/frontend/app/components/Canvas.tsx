"use client"
import { useEffect, useRef, useState } from "react"
import { Game } from "../game/Game";
import CollaborateModal from "./CollaborateModal";
import { JOIN_ROOM, WS_URL } from "@repo/common/config";
import { Tools } from "../types/types";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function Canvas({ roomId, IsCollaborating, isAdmin, collaborationToken, userToken }: {
    roomId: string, IsCollaborating: boolean, isAdmin: boolean, collaborationToken: string, userToken: string
}) {
    const [isCollaborating, setIsCollaborating] = useState(IsCollaborating)
    const [windowW, setWindowW] = useState(0)
    const [windowH, setWindowH] = useState(0)
    const [collaborateModal, setCollaborateModal] = useState(false);
    const [currentScale, setCurrentScale] = useState<number>(100);

    const [socket, setSocket] = useState<null | WebSocket>(null)

    const ws_url = `${WS_URL}?token=${userToken}`;

    useEffect(() => {
        const ws = new WebSocket(ws_url);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: JOIN_ROOM,
                roomId: roomId
            }))
        }
    }, [])

    const [game, setGame] = useState<Game>()

    const [selectedTool, setSelectedTool] = useState<Tools>("rect");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (game) {
            game.setShape(selectedTool);
        }
    }, [game, selectedTool])

    useEffect(() => {
        setWindowH(window.innerHeight)
        setWindowW(window.innerWidth)
        if (canvasRef.current && socket) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g)
            return () => {
                g.destroy()
            }
        }
    }, [canvasRef, socket])

    useEffect(() => {
        if (game) {
            game.setScale(currentScale / 100)
        }
    }, [currentScale])

    return (
        <>
            {
                game && collaborateModal && <CollaborateModal isCollaborating={isCollaborating} setIsCollaborating={setIsCollaborating} roomId={roomId} setCollaborateModal={setCollaborateModal} collaborationToken={collaborationToken} socket={socket} />
            }
            {/* Window size should be controlled */}
            <canvas ref={canvasRef} width={windowW} height={windowH} className={`${selectedTool === 'text' && 'cursor-text'}`} />
            {
                game &&
                <>
                    <TopBar isAdmin={isAdmin} selectedTool={selectedTool} setSelectedTool={setSelectedTool} inCollaboration={isCollaborating} func={() => setCollaborateModal(true)} setStrokeStyle={game.setStrokeStyle}/>
                    <Footer currentScale={currentScale} setScale={setCurrentScale} />
                </>
            }
        </>
    );
}