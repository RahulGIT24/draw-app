import { HTTP_BACKEND } from "@repo/common/config"
import axios from "axios"
import { Shape } from "../types/types"

export async function getExistingShapes(roomId: string | string[]) {
    try {
        const url = `/api/get-existing-shapes/${roomId}`
        const res = await axios.get(url)
        const shape = res.data.shapes.map((shape: any) => {
            if (shape.type == 'rect') {
                return {
                    type: shape.type,
                    height: shape.height,
                    x: shape.x,
                    y: shape.y,
                    width: shape.width
                }
            }else if(shape.type==='circle'){
                return {
                    type: shape.type,
                    centerX: shape.x,
                    centerY: shape.y,
                    radius: shape.radius,
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
    }

    try {
        const res = await axios.post(url, data, {
            headers: {
                authorization: localStorage.getItem("token")
            },
        })
        console.log(res)
    } catch (error) {
        console.log(error);
    }

}