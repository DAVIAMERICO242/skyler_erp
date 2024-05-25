import { Router } from "express";
import { RequestModel } from "../schemas/this-api/schemas";
import { Response } from "express";
import jwt from 'jsonwebtoken';
import { JwtModel } from "../schemas/this-api/schemas";

export const ProtectFrontendRoutes_router = Router();

ProtectFrontendRoutes_router.post("/auth_painel", (req:RequestModel, res:Response) => {
    const token = req?.headers['token'] as string;
    if(!token){
        res.status(400).end('ACESSO ILEGAL A ROTA FRONTEND');
    }else{
        try{
            const decoded:(JwtModel) = jwt.verify(token,process.env.JWT_SECRET as string) as JwtModel;
            res.status(200).send({
                success:true
            });
        }catch(err){
            res.status(400).send({
                succcess:false
            });
        }
    }
});