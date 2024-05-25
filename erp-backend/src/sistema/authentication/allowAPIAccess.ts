import { Router, Response, NextFunction } from "express";
import { RequestModel,JwtModel} from "../schemas/this-api/schemas";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const AuthMiddleware = (req: RequestModel,
    res: Response,
    next:NextFunction)=>{

    const token = req?.headers['token'] as string;
    if(!token){
        res.status(400).end('ACESSO ILEGAL A API');
    }else{
        try{
            const decoded:(JwtModel) = jwt.verify(token,process.env.JWT_SECRET as string) as JwtModel;
            req.username = decoded.username;
            next();
        }catch(err){
            res.status(400).end('ACESSO ILEGAL A API');
        }
    }
}