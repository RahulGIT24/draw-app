import { addShapeInDB, getExistingShapes } from "./http"
import { Shape, Shapes } from "../types/types"
import { DRAW_SHAPE } from "@repo/common/config"

export class Game {

    // variables;
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private clicked: boolean
    private startX: number
    private startY: number
    socket: WebSocket
    private selectedShape: Shapes = "rect";

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.existingShapes = []
        this.roomId = roomId
        this.clicked = false;
        this.socket = socket
        this.startX = 0
        this.startY = 0

        this.init();
        this.initHandlers();
        this.initMouseEventHandlers();
    }

    setShape(shape: Shapes) {
        console.log("Shape Set")
        this.selectedShape = shape
    }

    renderShapes(shape: Shape) {
        this.ctx.strokeStyle = shape.strokeStyle ?? "rgba(255,255,255)";
        switch (shape.type) {
            case 'rect':
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case 'circle':
                const centerX = shape.centerX
                const centerY = shape.centerY
                const radius = shape.radius
                this.ctx.beginPath()
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke()
                this.ctx.closePath();
                break;
            case 'line':
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                break;
            case 'triangle':
                break
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.forEach((shape) => (
            this.renderShapes(shape)
        ))
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDown)
        this.canvas.removeEventListener("mouseup", this.mouseUp)
        this.canvas.removeEventListener("mousemove", this.mouseMove)
    }


    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === DRAW_SHAPE) {
                const shape = message.shape;

                if (!shape) return;
                console.log(shape);

                this.existingShapes.push(shape)
                this.clearCanvas()
            }
        }
    }

    mouseDown = async (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUp = async (e: MouseEvent) => {
        this.clicked = false;
        let width = e.clientX - this.startX;
        let height = e.clientY - this.startY;

        let data: Shape | null = null

        if (this.selectedShape === 'rect') {
            data = { type: "rect", x: this.startX, y: this.startY, width, height };
        } else if (this.selectedShape === 'circle') {
            data = { type: "circle", centerX: this.startX + width / 2, centerY: this.startY + height / 2, radius: Math.sqrt(width * width + height * height) / 2, };
        } else if (this.selectedShape === 'pencil') {
            data = { type: "line", startX: this.startX, startY: this.startY, endX: e.clientX, endY: e.clientY, }
        }
        if (!data) return;
        this.socket.send(JSON.stringify({
            type: "SHAPE",
            shape: data,
            roomId: this.roomId
        }));

        this.existingShapes.push(data);
        this.clearCanvas()
        await addShapeInDB(this.roomId, data);
    }

    mouseMove = (e: MouseEvent) => {
        if (this.clicked) {
            let width = e.clientX - this.startX;
            let height = e.clientY - this.startY;
            this.clearCanvas()
            this.ctx.strokeStyle = "rgba(255,255,255)";

            let previewShape: Shape | null = null;

            if (this.selectedShape == 'rect') {
                previewShape = { type: 'rect', x: this.startX, y: this.startY, width: width, height }
            }
            else if (this.selectedShape == 'circle') {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = Math.sqrt(width * width + height * height) / 2;
                previewShape = { type: 'circle', centerX, centerY, radius }
            }
            else if (this.selectedShape == "pencil") {
                previewShape = { type: 'line', startX: this.startX, startY: this.startY, endX: e.clientX, endY: e.clientY }
            } else if (this.selectedShape === 'triangle') {
                
            }

            if (previewShape) this.renderShapes(previewShape);
        }
    }

    initMouseEventHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDown);
        this.canvas.addEventListener("mousemove", this.mouseMove);
        this.canvas.addEventListener("mouseup", this.mouseUp);
    }
}