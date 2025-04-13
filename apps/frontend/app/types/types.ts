export type Shape = {
    id?:string
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle: string,
    fillStyle?: string
    isDeleted?:boolean,
} | {
    id?:string
    type: "circle",
    x: number,
    y: number,
    radius: number,
    strokeStyle: string,
    fillStyle?: string
    isDeleted?:boolean,
}|{
    id?:string
    type:"line",
    x:number,
    y:number,
    endX:number,
    endY:number,
    strokeStyle: string,
    fillStyle?: string,
    isDeleted?:boolean,
}|{
    id?:string
    type:"triangle",
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
    strokeStyle: string;
    fillStyle?: string;
    isDeleted?:boolean,
}|{
    id?:string
    type:"text"
    x:number
    y:number
    width:number
    fillStyle: string;
    text:string
    isDeleted?:boolean,
}

export type Shapes = "circle" | "rect" | "pencil" | "triangle" | "text" | "eraser"

export type Room = {
    id: number,
    slug: string,
    createdAt: string
}

export type Tools = Shapes;

export type COLOR = "red" | "blue" | "white" | "yellow" | "green"
