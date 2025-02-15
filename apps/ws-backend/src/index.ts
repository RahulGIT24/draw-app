import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { JWT_SEC } from "./config";

const PORT = 8000;

const wss = new  WebSocketServer({port:PORT});

wss.on('connection',(ws,request)=>{
    console.log("Client Connected");

    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") as string;
    if(!token){
        ws.close()
        return;
    }

    // validate the token by jwt.verify
    const decoded = jwt.verify(token,JWT_SEC)

    if(typeof decoded=="string"){
        ws.close();
        return;
    }

    if(!decoded || !decoded.userId){
        ws.close();
        return;
    }

    ws.on('message',(message)=>{
        console.log('Received Message ',message);
    })
})