import { NextFunction, Request, Response } from "express";
import jwt,{JwtPayload} from "jsonwebtoken"
import { JWT_SEC } from "./config";

interface DecodedToken extends JwtPayload{
    userId:string
}

export function middleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] ?? "";

    const decoded  = jwt.verify(token,JWT_SEC) as DecodedToken;

    if(typeof decoded === "string"){
        res.status(403).json({
            message:"Unauthorized"
        })
    }

    if(decoded){
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}