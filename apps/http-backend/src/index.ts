import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SEC } from "./config";
import { middleware } from "./middleware";

const app = express();
const PORT=5000

app.get("/health-check",(req,res)=>{
    res.send('Health Checked')
})

app.post("/signin",(req,res)=>{
    // zod validation and db call
    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SEC)

    res.status(200).json({token})
})

app.post("/signup",(req,res)=>{
    // zod validation and db call
    
})

app.post("/room",middleware,(req,res)=>{
    // db call
})

app.listen(PORT,()=>{
    console.log(`Http Backend Listening on ${PORT}`)
})