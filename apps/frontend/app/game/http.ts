import axios from "axios"
import { Shape } from "../types/types"

export async function getExistingShapes(roomId: string | string[]) {
    try {
        const url = `/api/get-existing-shapes/${roomId}`
        const res = await axios.get(url)
        const shape = res.data.shapes.map((shape: any) => {
            if (shape.type == 'rect') {
                return {
                    id:shape.id,
                    type: shape.type,
                    height: shape.height,
                    x: shape.x,
                    y: shape.y,
                    width: shape.width
                }
            }else if(shape.type==='circle'){
                return {
                    id:shape.id,
                    type: shape.type,
                    centerX: shape.x,
                    centerY: shape.y,
                    radius: shape.radius,
                }
            }
            else if(shape.type==='line'){
                return {
                    id:shape.id,
                    type: shape.type,
                    startX: shape.x,
                    startY: shape.y,
                    endX: shape.endX,
                    endY: shape.endY,
                    strokeStyle:shape.strokeStyle
                }
            }else if(shape.type==='text'){
                return {
                    id:shape.id,
                    type: shape.type,
                    x: shape.x,
                    text:shape.text,
                    y: shape.y,
                    width: shape.width,
                    fillStyle:shape.fillStyle
                }
            }
        })
        return shape
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function addShapeInDB(roomId: string | string[], shape: Shape) {
    const url = `/api/add-shapes/${roomId}`
    let data:any;
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
    } else if (shape.type == 'circle') {
        data=shape;
        data.strokeStyle = "rgba(255,255,255)"
        data.fillStyle = "rgba(0,0,0)"
    }else if(shape.type === 'text'){
        data=shape;
    }else if(shape.type==='line'){
        data=shape
        data.strokeStyle = "rgba(255,255,255)"
    }

    try {
        const res = await axios.post(url, data)
        return res.data.shape.id
    } catch (error) {
        console.log(error);
    }

}