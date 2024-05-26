import { Router } from "express";
import { RequestModel } from "../schemas/this-api/schemas";
import { Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtModel } from "../schemas/this-api/schemas";

export const login_router = Router();

login_router.post("/login", (req:RequestModel, res:Response) => {
    const {username,password} = req.body;
    if(!username ||!password){
        res.status(400).send({
            success:false
        });
    }else{
        const token = jwt.sign({username,password},process.env.JWT_SECRET as string);
        res.status(200).send({
            success:true,
            token:token,
            username:username
        });
    }
})