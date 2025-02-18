import { HTTP_BACKEND } from "@repo/common/config";
import axios from "axios";
import { RefObject } from "react";

type Shape={
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
}

let existingShapes:Shape[] = []

export async function initDraw(canvasRef: RefObject<HTMLCanvasElement | null>, roomId: string | string[],socket:WebSocket) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.onmessage = (event)=>{
        const message = JSON.parse(event.data);
        if(message.type==="DRAW_SHAPE"){
            const shape = message.shape;
            existingShapes.push({
                type:"rect", 
                height:shape.height,
                width:shape.width,
                x:shape.x,
                y:shape.y
            })
            requestAnimationFrame(() => clearCanvas(canvas, ctx));
        }
    }

    // Wait for shapes before proceeding
    const shapes = await getExistingShapes(roomId);
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
    requestAnimationFrame(() => clearCanvas(canvas, ctx));

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup", async (e) => {
        clicked = false;
        let width = e.clientX - startX;
        let height = e.clientY - startY;
        const data: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            height,
            width,
        };
        socket.send(JSON.stringify({
            type:"SHAPE",
            shape:data,
            roomId:roomId
        }))
        existingShapes.push(data);
        await addShapeInDB(roomId, data);

        // Re-render to show the newly added shape
        requestAnimationFrame(() => clearCanvas(canvas, ctx));
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            let width = e.clientX - startX;
            let height = e.clientY - startY;
            requestAnimationFrame(() => {
                clearCanvas(canvas, ctx);
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.strokeRect(startX, startY, width, height);
            });
        }
    });
}

async function addShapeInDB(roomId:string | string[],shape:Shape){
    const url = `${HTTP_BACKEND}/add-shapes/${roomId}`
    let data = {};
    if(shape.type=='rect'){
        data = {
            type:shape.type,
            x:shape.x,
            y:shape.y,
            width:shape.width,
            height:shape.height,
            strokeStyle:"rgba(255,255,255)",
            fillStyle:"rgba(0,0,0)"
        }
    }

    try {
        const res = await axios.post(url,data,{
            headers:{
                authorization: localStorage.getItem("token")
            },
        })
        console.log(res)
    } catch (error) {
        console.log(error);
    }

}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🛠️ Ensure shapes are drawn after clearing
    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    });
}
async function getExistingShapes(roomId:string | string[]){
    try {
        const url  = `${HTTP_BACKEND}/get-existing-shapes/${roomId}`
        const res = await axios.get(url,{
            headers:{
                authorization: localStorage.getItem("token")
            },
        })
        const shape = res.data.shapes.map((shape:Shape)=>{
            if(shape.type=='rect'){
                // console.log(shape)
                return {
                    type:shape.type ?? "rect",
                    height:shape.height,
                    x:shape.x,
                    y:shape.y,
                    width:shape.width
                }
            }
        })
        return shape
    } catch (error) {
        console.log(error);
        return null
    }
}