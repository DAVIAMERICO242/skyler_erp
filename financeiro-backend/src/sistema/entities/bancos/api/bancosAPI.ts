import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';
import { cadastroBanco, deleteBanco } from '../database/bancosDB';
import { BancoFrontendFormInput } from '../../../schemas/this-api/schemas';
import { getBancos } from '../database/bancosDB';
import { updateBanco } from '../database/bancosDB';
import { changeBancoFrontendFormInput } from '../../../schemas/this-api/schemas';

export const bancos_router = Router();

bancos_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {banco} = req.body;
    try{
        const response = await cadastroBanco(banco as BancoFrontendFormInput);
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

bancos_router.get('/get',async (req:RequestModel,res:Response)=>{
    try{
        const response = await getBancos();
        res.status(200).send({
            success:true,
            data:response
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})

bancos_router.post('/update',async (req:RequestModel,res:Response)=>{
    const {banco} = req.body;
    try{
        const response = await updateBanco(banco as changeBancoFrontendFormInput);
        res.status(200).send({
            success:true,
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})

bancos_router.post('/delete',async (req:RequestModel,res:Response)=>{
    const {banco} = req.body;
    try{
        const response = await deleteBanco(banco as string);
        res.status(200).send({
            success:true,
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            foreign_key: error?.foreign_key,
            duplicate: error?.duplicate
        })
    }
})



