"use client"

import { useEffect, useRef, useState } from "react"
import { initDraw, Shape } from "../draw";
import { Button } from "@repo/ui/button";

export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const [currentShape, setCurrentShape] = useState("rect")
    let existingShapes: Shape[] = []

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (roomId) {
            initDraw(canvasRef, roomId, socket, currentShape,existingShapes)
        }
    }, [canvasRef, currentShape, roomId, socket])

    const shapes = [{
        id: 1,
        type: 'rect',
        title: "Rectangle",
        image: "/rectangle.svg",
        onClick: () => {
            setCurrentShape('rect')
        }
    }, {
        id: 2,
        type: 'circle',
        title: "Circle",
        image: "/circle.svg",
        onClick: () => {
            setCurrentShape('circle')
        }
    }]

    return (
        <>
            <div className="absolute top-2 left-1/2 mt-6 -translate-x-1/2 flex gap-2 bg-zinc-800 justify-center border-transparent w-[50vw] border p-2 rounded-lg shadow-lg">
                {shapes.map((shape) => (
                    <Button classname={`px-2 py-1 text-white border border-transparent rounded bg-transparent ${shape.type == currentShape ? "bg-gray-300" : "bg-transparent"}`} key={shape.id} onClick={shape.onClick} image={shape.image} imageclass={`${shape.type === currentShape ? "invert-0" : "invert"}`} title={shape.title} />
                ))}
            </div>
            <canvas ref={canvasRef} width={2000} height={1000} />
        </>
    );

}