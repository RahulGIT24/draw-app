import express from "express"
import jwt from "jsonwebtoken"
import { EXPIRY, JWT_SEC } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {client} from "@repo/db/prisma"
import bcrypt from "bcrypt"
import {CreateUserSchema,SignInSchema} from "@repo/common/zod"

const app = express();

app.use(express.json())

const PORT = 5000

app.get("/health-check", (req, res) => {
    res.send('Health Checked')
})

app.post("/signin", async(req, res) => {
    try {
        
        const data = req.body;
    
        const dataValid = SignInSchema.safeParse(data);
    
        if(!dataValid.success){
            res.status(400).json({"message":dataValid.error.errors[0]?.message ?? "Invalid Input"})
            return;
        }
    
        const checkUser = await client.user.findFirst({
            where:{
                username:data.username
            },
            select:{
                id:true,
                password:true
            }
        })
    
        if(!checkUser){
            res.status(400).json({"message":"User not exist"})
            return;
        }
    
        const checkPassword = await bcrypt.compare(dataValid.data.password, checkUser.password);
    
        if(!checkPassword){
            res.status(400).json({"message":"invalid credentials"})
            return;
        }
    
        const userId = checkUser.id;
    
        // const jwtexpiry = EXPIRY;
    
        const token = jwt.sign({
            userId
        }, JWT_SEC,{expiresIn:"1h"})
    
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({"message":"Internal Server Error"})
        console.log("Error",error);
    }
})

app.post("/signup", async(req, res) => {
    try {
        const data = req.body;
        // validate
        const dataValid = CreateUserSchema.safeParse(req.body);

        if(dataValid.success===false){
            res.status(400).json({"message":dataValid.error?.errors[0]?.message ?? "Invalid Input"})
            return;
        }
    
        const checkUser = await client.user.findFirst({
            where:{
                username:data.username
            },
            select:{
                id:true
            }
        })
    
        if(checkUser){
            res.status(201).json({"message":"Username already taken"})
            return;
        }

        const hashedPassword = await bcrypt.hash(dataValid.data.password ,10);

        dataValid.data.password = hashedPassword;
    
        // put it in db
        const user = await client.user.create({
            data:dataValid.data
        })
    
        if(user){
            res.status(201).json({"message":"created","data":user})
        }
        
    } catch (error) {
        res.status(500).json({"message":"Internal Server Error"})
        console.log("Error",error);
    }
})

app.post("/room", middleware, (req, res) => {
    // db call
})

app.listen(PORT, () => {
    console.log(`Http Backend Listening on ${PORT}`)
})