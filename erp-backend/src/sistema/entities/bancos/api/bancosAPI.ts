import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';
import { cadastroBancos } from '../database/bancosDB';
import { Banco } from '../../../schemas/this-api/schemas';

export const bancos_router = Router();

bancos_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {banco} = req.body;
    try{
        const response = await cadastroBancos(banco as Banco);
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
