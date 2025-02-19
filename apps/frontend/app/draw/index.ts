import { HTTP_BACKEND } from "@repo/common/config";
import axios from "axios";
import { RefObject } from "react";

export type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle?:string,
    fillStyle?:string
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    startAngle:number,
    endAngle:number,
    strokeStyle?:string,
    fillStyle?:string
}

export async function initDraw(canvasRef: RefObject<HTMLCanvasElement | null>, roomId: string | string[], socket: WebSocket, shape: string,existingShapes:Shape[]) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "DRAW_SHAPE") {
            const shape = message.shape;
            existingShapes.push({
                type: "rect",
                height: shape.height,
                width: shape.width,
                x: shape.x,
                y: shape.y
            })
            requestAnimationFrame(() => clearCanvas(canvas, ctx,existingShapes));
        }
    }

    // Wait for shapes before proceeding
    const shapes = await getExistingShapes(roomId);
    // console.log(shapes)
    if (shapes) {
        existingShapes = shapes;
    }

    // Draw background
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let startX = 0;
    let startY = 0;
    let clicked = false;

    // 🛠️ Draw existing shapes AFTER clearing canvas
    requestAnimationFrame(() => clearCanvas(canvas, ctx,existingShapes));

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", async (e) => {
        clicked = false;
        let width = e.clientX - startX;
        let height = e.clientY - startY;

        if (shape == 'rect') {
            const data: Shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width,
            };
            socket.send(JSON.stringify({
                type: "SHAPE",
                shape: data,    
                roomId: roomId
            }))
            existingShapes.push(data);
            await addShapeInDB(roomId, data);
        } else if (shape == 'circle') {
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;
            const data: Shape = {
                type: "circle",
                centerX,
                centerY,
                radius,
                startAngle:0,
                endAngle:Math.PI * 2,
                strokeStyle: "rgba(255,255,255)",
                fillStyle: "rgba(0,0,0)"
            };
            await addShapeInDB(roomId, data);
            socket.send(JSON.stringify({
                type: "SHAPE",
                shape: data,    
                roomId: roomId
            }))
            existingShapes.push(data)
        }


        // Re-render to show the newly added shape
        requestAnimationFrame(() => clearCanvas(canvas, ctx,existingShapes));
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            let width = e.clientX - startX;
            let height = e.clientY - startY;
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;

            if (shape == 'rect') {
                requestAnimationFrame(() => {
                    clearCanvas(canvas, ctx,existingShapes);
                    ctx.strokeStyle = "rgba(255,255,255)";
                    ctx.strokeRect(startX, startY, width, height);
                });
            } else {
                requestAnimationFrame(() => {
                    clearCanvas(canvas, ctx,existingShapes);
                    ctx.strokeStyle = "rgba(255,255,255)";
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.stroke();
                })
            }
        }
    });
}

async function addShapeInDB(roomId: string | string[], shape: Shape) {
    const url = `${HTTP_BACKEND}/add-shapes/${roomId}`
    let data = {};
    if (shape.type == 'rect') {
        data = {
            type: shape.type,
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            strokeStyle: "rgba(255,255,255)",
            fillStyle: "rgba(0,0,0)"
        }
    }else if(shape.type=='circle'){
        data=shape
    }

    try {
        const res = await axios.post(url, data, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        })
        console.log(res)
    } catch (error) {
        console.log(error);
    }

}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,existingShapes:Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🛠️ Ensure shapes are drawn after clearing
    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        else if (shape.type === "circle") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, shape.startAngle, shape.endAngle);
            ctx.stroke();
        }
    });

}
async function getExistingShapes(roomId: string | string[]) {
    try {
        const url = `${HTTP_BACKEND}/get-existing-shapes/${roomId}`
        const res = await axios.get(url, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        })
        const shape = res.data.shapes.map((shape: any) => {
            if (shape.type == 'rect') {
                // console.log(shape)
                return {
                    type: shape.type,
                    height: shape.height,
                    x: shape.x,
                    y: shape.y,
                    width: shape.width
                }
            }else if(shape.type==='circle'){
                return {
                    type: shape.type,
                    centerX: shape.x,
                    centerY: shape.y,
                    width: shape.width,
                    endAngle:shape.endAngle,
                    startAngle:shape.startAngle,
                    radius:shape.radius
                }
            }
        })
        return shape
    } catch (error) {
        console.log(error);
        return null
    }
}