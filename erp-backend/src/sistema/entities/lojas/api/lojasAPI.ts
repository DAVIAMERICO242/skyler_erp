import {Router, Response} from 'express';
import { DBError, RequestModel } from '../../../schemas/this-api/schemas';
import { Loja } from '../../../schemas/this-api/schemas';
import { cadastroLojas } from '../database/lojasDB';

export const lojas_router = Router();

lojas_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await cadastroLojas(loja as Loja);
        res.status(200).send({
            success:true
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})