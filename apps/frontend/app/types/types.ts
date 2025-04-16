export type Shape = {
    id?: string
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle: string,
    fillStyle?: string
    isDeleted?: boolean,
} | {
    id?: string
    type: "circle",
    x: number,
    y: number,
    radius: number,
    strokeStyle: string,
    fillStyle?: string
    isDeleted?: boolean,
} | {
    id?: string
    type: "line",
    x: number,
    y: number,
    endX: number,
    endY: number,
    strokeStyle: string,
    fillStyle?: string,
    isDeleted?: boolean,
} | {
    id?: string
    type: "triangle",
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
    strokeStyle: string;
    fillStyle?: string;
    isDeleted?: boolean,
} | {
    id?: string
    type: "text"
    x: number
    y: number
    width: number
    fillStyle: string;
    text: string
    isDeleted?: boolean,
}

export type Shapes = "circle" | "rect" | "pencil" | "triangle" | "text" | "eraser"

export type Room = {
    id: number,
    slug: string,
    createdAt: string
}

export type Tools = Shapes;

export type COLOR = "#FFFFFF" | "#28A745" | "#FFC107" | "#DC3545"

export interface IAvailableColors {
    title: string,
    color: COLOR
}

export interface IColorMap { title: string, color: COLOR, setColor: (color: COLOR) => void,setState:React.Dispatch<React.SetStateAction<COLOR>>,setOpen:(arg:boolean)=>void }

export interface IEmail {
    subject:'SIGNUP',
    to:string
}