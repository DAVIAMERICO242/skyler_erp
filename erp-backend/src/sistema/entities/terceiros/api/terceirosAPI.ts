import {Router, Response} from 'express';
import { DBError, RequestModel } from '../../../schemas/this-api/schemas';
import { cadastroTerceiros } from '../database/terceirosDB';
import { Terceiro } from '../../../schemas/this-api/schemas';

export const terceiros_router = Router();

terceiros_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {terceiro} = req.body;
    try{
        const response = await cadastroTerceiros(terceiro as Terceiro);
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