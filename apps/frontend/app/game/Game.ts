import { getExistingShapes } from "./http";
import { COLOR, Shape, Shapes } from "../types/types";
import { DRAW_SHAPE, ERASE, FULL, OFF_COLLABORATION } from "@repo/common/config";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

export class Game {
    // Canvas fields
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private roomId: string;
    private clicked: boolean = false;
    private scale: number = 1;
    private startX: number = 0;
    private startY: number = 0;
    private selectedShape: Shapes = "rect";
    public strokeStyle: COLOR = "#FFFFFF";
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.socket = socket;

        this.init();
        this.initHandlers();
        this.initMouseEventHandlers();
    }

    public setScale(scale: number) {
        this.scale = scale;
        this.clearCanvas();
    }

    setShape(shape: Shapes) {
        this.selectedShape = shape;
    }

    public setStrokeStyle = (color: COLOR) => {
        this.strokeStyle = color;
    }

    // --- Core Rendering ---
    renderShapes(shape: Shape) {
        if (shape.isDeleted) return;
        switch (shape.type) {
            case "rect":
                this.ctx.strokeStyle = shape.strokeStyle;
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case "circle":
                this.ctx.strokeStyle = shape.strokeStyle;
                this.ctx.beginPath();
                this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
                break;
            case "line":
                this.ctx.strokeStyle = shape.strokeStyle;
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x, shape.y);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                break;
            case "text":
                this.ctx.fillStyle = shape.fillStyle;
                this.ctx.font = "22px sans-serif";
                this.ctx.fillText(shape.text, shape.x, shape.y, shape.width);
                break;
        }
    }

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-centerX, -centerY);
        this.ctx.fillStyle = "#1E1E1E";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.forEach((shape) => this.renderShapes(shape));
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDown);
        this.canvas.removeEventListener("mouseup", this.mouseUp);
        this.canvas.removeEventListener("mousemove", this.mouseMove);
    }

    // --- Real-Time Collaboration Message Handlers ---
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === DRAW_SHAPE) {
                this.existingShapes.push(message.shape);
                this.clearCanvas();
            }
            if (message.type === ERASE) {
                const shapeId = message.shape.id;
                const shapeIndex = this.existingShapes.findIndex(shape => shape.id === shapeId);
                if (shapeIndex !== -1) {
                    this.existingShapes[shapeIndex].isDeleted = true;
                    this.clearCanvas();
                }
            }
            if (message.type === FULL) {
                toast.info(message.message);
            }
            if (message.type === OFF_COLLABORATION) {
                toast.error(message.message);
                location.reload();
            }
        };
    }

    // --- Main Mouse Events ---
    mouseDown = (e: MouseEvent) => {
        const { x, y } = this.getUnscaledPoint(e.clientX, e.clientY);
        this.clicked = true;
        this.startX = x;
        this.startY = y;

        if (this.selectedShape === "text") {
            this.addTextInput(e.clientX, e.clientY, x, y);
        }

        if (this.selectedShape === "eraser") {
            const shapeIndex = this.existingShapes.findIndex(shape => this.isPointInShape(x, y, shape));
            if (shapeIndex !== -1) {
                const shapeToRemove = this.existingShapes[shapeIndex];
                this.existingShapes.splice(shapeIndex, 1);
                this.socket.send(JSON.stringify({
                    type: "ERASE",
                    shape: shapeToRemove,
                    roomId: this.roomId
                }));
                this.clearCanvas();
            }
        }
    };

    mouseUp = (e: MouseEvent) => {
        const { x, y } = this.getUnscaledPoint(e.clientX, e.clientY);
        this.clicked = false;
        let width = x - this.startX;
        let height = y - this.startY;
        let data: Shape | null = null;

        if (this.selectedShape === "rect") {
            data = { id: uuid(), type: "rect", x: this.startX, y: this.startY, width, height, strokeStyle: this.strokeStyle };
        } else if (this.selectedShape === "circle") {
            data = { id: uuid(), type: "circle", x: this.startX + width / 2, y: this.startY + height / 2, radius: Math.sqrt(width * width + height * height) / 2, strokeStyle: this.strokeStyle };
        } else if (this.selectedShape === "pencil") {
            data = { id: uuid(), type: "line", x: this.startX, y: this.startY, endX: x, endY: y, strokeStyle: this.strokeStyle };
        }
        if (data) {
            this.socket.send(JSON.stringify({
                type: "SHAPE",
                shape: data,
                roomId: this.roomId
            }));
            this.existingShapes.push(data);
            this.clearCanvas();
        }
    };

    mouseMove = (e: MouseEvent) => {
        const { x, y } = this.getUnscaledPoint(e.clientX, e.clientY);
        if (this.clicked && this.selectedShape !== "text" && this.selectedShape !== "eraser") {
            let width = x - this.startX;
            let height = y - this.startY;
            this.clearCanvas();
            let previewShape: Shape | null = null;

            if (this.selectedShape === "rect") {
                previewShape = { type: "rect", x: this.startX, y: this.startY, width, height, strokeStyle: this.strokeStyle };
            } else if (this.selectedShape === "circle") {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = Math.sqrt(width * width + height * height) / 2;
                previewShape = { type: "circle", x: centerX, y: centerY, radius, strokeStyle: this.strokeStyle };
            } else if (this.selectedShape === "pencil") {
                previewShape = { type: "line", x: this.startX, y: this.startY, endX: x, endY: y, strokeStyle: this.strokeStyle };
            }

            if (previewShape) this.renderShapes(previewShape);
        }
    };

    // --- Coordinate Handling ---
    getUnscaledPoint(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        const px = (clientX - rect.left) * (this.canvas.width / rect.width);
        const py = (clientY - rect.top) * (this.canvas.height / rect.height);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        return {
            x: (px - centerX) / this.scale + centerX,
            y: (py - centerY) / this.scale + centerY
        };
    }

    // --- Text Input Corrected for Scale ---
    addTextInput(screenX: number, screenY: number, canvasX: number, canvasY: number) {
        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "fixed";
        input.style.background = "transparent";
        input.style.font = "22px sans-serif";
        input.style.outline = "none";
        input.style.left = `${screenX}px`;
        input.style.top = `${screenY - 22 / 1.5}px`;
        input.style.color = this.strokeStyle;

        document.body.appendChild(input);
        setTimeout(() => input.focus(), 0);

        input.addEventListener("blur", () => {
            const text = input.value;
            if (text.trim() !== "") {
                this.addTextToCanvas(text, canvasX, canvasY);
            }
            document.body.removeChild(input);
        });
    }

    async addTextToCanvas(text: string, x: number, y: number) {
        const textShape: Shape = {
            id: uuid(),
            type: "text",
            x,
            y,
            text,
            width: 200,
            fillStyle: this.strokeStyle
        };
        this.existingShapes.push(textShape);
        this.clearCanvas();
        this.socket.send(JSON.stringify({
            type: "SHAPE",
            shape: textShape,
            roomId: this.roomId
        }));
    }

    // --- Hit Functions (for Eraser & Other Operations) ---
    isPointInShape(x: number, y: number, shape: Shape): boolean {
        const padding = 5;
        switch (shape.type) {
            case "rect":
                return (
                    Math.abs(x - shape.x) <= padding && y >= shape.y - padding && y <= shape.y + shape.height + padding ||
                    Math.abs(x - (shape.x + shape.width)) <= padding && y >= shape.y - padding && y <= shape.y + shape.height + padding ||
                    Math.abs(y - shape.y) <= padding && x >= shape.x - padding && x <= shape.x + shape.width + padding ||
                    Math.abs(y - (shape.y + shape.height)) <= padding && x >= shape.x - padding && x <= shape.x + shape.width + padding
                );
            case "circle":
                const dist = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
                return Math.abs(dist - shape.radius) <= padding;
            case "line":
                return this.isPointNearLine(x, y, shape.x, shape.y, shape.endX, shape.endY);
            case "text":
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
        if (param < 0) { xx = x1; yy = y1; }
        else if (param > 1) { xx = x2; yy = y2; }
        else { xx = x1 + param * C; yy = y1 + param * D; }
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
    }

    // --- Event Handlers ---
    initMouseEventHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDown);
        this.canvas.addEventListener("mousemove", this.mouseMove);
        this.canvas.addEventListener("mouseup", this.mouseUp);
    }
}
