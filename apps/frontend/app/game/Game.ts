import { addShapeInDB, getExistingShapes } from "./http"
import { Shape, Shapes } from "../types/types"
import { DRAW_SHAPE, ERASE } from "@repo/common/config"

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
            case 'text':
                this.ctx.fillStyle = shape.fillStyle ?? 'white'
                this.ctx.font = '22px sans-serif';
                this.ctx.fillText(shape.text, shape.x, shape.y, shape.width)
                break
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.existingShapes) return;
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

                this.existingShapes.push(shape)
                this.clearCanvas()
            }
            if (message.type === ERASE) {
                const shapeToRemove = JSON.stringify(message.shape);
                const shapeIndex = this.existingShapes.findIndex(shape => JSON.stringify(shape) == shapeToRemove)
                if (shapeIndex && shapeIndex !== - 1) {
                    this.existingShapes.splice(shapeIndex, 1)
                }
                this.clearCanvas()
            }

        }
    }

    mouseDown = async (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if (this.selectedShape === 'text') {
            this.addText(e.clientX, e.clientY);
        }

        // erase image when eraser is selected and clicked on image
        if (this.selectedShape === 'eraser') {
            const shapeIndex = this.existingShapes.findIndex(shape => this.isPointInShape(e.clientX, e.clientY, shape))

            if (shapeIndex !== -1) {
                const shapeToRemove = this.existingShapes[shapeIndex];
                this.existingShapes.splice(shapeIndex, 1)
                this.socket.send(JSON.stringify({
                    type: "ERASE",
                    shape: shapeToRemove,
                    roomId: this.roomId
                }))
                this.clearCanvas()
            }
        }
    }

    isPointInShape(x: number, y: number, shape: Shape): boolean {
        const padding = 5;

        switch (shape.type) {
            case 'rect':
                const nearLeft = Math.abs(x - shape.x) <= padding && y >= shape.y - padding && y <= shape.y + shape.height + padding;
                const nearRight = Math.abs(x - (shape.x + shape.width)) <= padding && y >= shape.y - padding && y <= shape.y + shape.height + padding;
                const nearTop = Math.abs(y - shape.y) <= padding && x >= shape.x - padding && x <= shape.x + shape.width + padding;
                const nearBottom = Math.abs(y - (shape.y + shape.height)) <= padding && x >= shape.x - padding && x <= shape.x + shape.width + padding;

                return nearLeft || nearRight || nearTop || nearBottom;

            case 'circle':
                const distanceFromCenter = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
                return Math.abs(distanceFromCenter - shape.radius) <= padding;

            case 'line':
                return this.isPointNearLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY);

            case 'text':
                return (
                    x >= shape.x && x <= shape.x + shape.width &&
                    y >= shape.y - 22 && y <= shape.y
                );

            default:
                return false;
        }
    }


    isPointNearLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number, tolerance = 5): boolean {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
    
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;
    
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
    
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
    }
    

    addText(x: number, y: number) {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'fixed';
        input.style.background = 'transparent';
        input.style.font = `22px sans-serif`
        input.style.outline = 'none'
        input.style.left = (x) + 'px';
        input.style.top = `${y - 22 / 1.5}px`
        input.style.color = 'white'

        document.body.appendChild(input);
        setTimeout(() => input.focus(), 0);

        input.addEventListener('blur', () => {
            const text = input.value;
            if (text.trim() !== '') {
                this.addTextToCanvas(text, x, y);
                document.body.removeChild(input)
            }
        })
    }

    // check
    async addTextToCanvas(text: string, x: number, y: number) {
        const textShape: Shape = {
            type: "text",
            x,
            y,
            text,
            width: 200,
            fillStyle: "white"
        };
        this.existingShapes.push(textShape);
        this.clearCanvas();

        const id = await addShapeInDB(this.roomId, textShape);
        this.existingShapes.map((shape) => {
            if (JSON.stringify(shape) === JSON.stringify(textShape)) {
                shape.id = id
            }
        })

        this.socket.send(JSON.stringify({
            type: "SHAPE",
            shape: textShape,
            roomId: this.roomId
        }));

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