export type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle?: string,
    fillStyle?: string
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    // startAngle: number,
    // endAngle: number,
    strokeStyle?: string,
    fillStyle?: string
}|{
    type:"line",
    startX:number,
    startY:number,
    endX:number,
    strokeStyle?: string,
    fillStyle?: string,
    endY:number
}|{
    type:"triangle",
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
    strokeStyle?: string;
    fillStyle?: string;
}

export type Shapes = "circle" | "rect" | "pencil" | "triangle"