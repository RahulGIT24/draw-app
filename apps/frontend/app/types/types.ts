export type Shape = {
    id?:number 
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle?: string,
    fillStyle?: string
} | {
    id?:number 
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    strokeStyle?: string,
    fillStyle?: string
}|{
    id?:number 
    type:"line",
    startX:number,
    startY:number,
    endX:number,
    endY:number,
    strokeStyle?: string,
    fillStyle?: string,
}|{
    type:"triangle",
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
    strokeStyle?: string;
    fillStyle?: string;
}|{
    id?:number 
    type:"text"
    x:number
    y:number
    width:number
    fillStyle?: string;
    strokeStyle?: string;
    text:string
}

export type Shapes = "circle" | "rect" | "pencil" | "triangle" | "text" | "eraser"

export type Room = {
    id: number,
    slug: string,
    createdAt: string
}

export type Tools = Shapes;
