import { Router } from "express";
import { RequestModel } from "../schemas/this-api/schemas";
import { Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtModel } from "../schemas/this-api/schemas";
import { User } from "../user/user";

export const login_router = Router();

login_router.post("/login", async (req:RequestModel, res:Response) => {
    console.log('oi')
    const {username,password} = req.body;

    const UserClass = new User(username);

    try{
        const check = await UserClass.validateCredentials(password);
        if(!check?.length){
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
    }catch{
        res.status(500).send({
            success:false
        });
    }
})