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
    endY:number
}

export type Shapes = "circle" | "rect" | "pencil"