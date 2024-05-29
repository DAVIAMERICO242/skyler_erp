import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';
import { cadastroBanco, deleteBanco } from '../database/bancosDB';
import { Banco } from '../../../schemas/this-api/schemas';
import { getBancos } from '../database/bancosDB';
import { updateBanco } from '../database/bancosDB';
import { changeBanco } from '../../../schemas/this-api/schemas';

export const bancos_router = Router();

bancos_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {banco} = req.body;
    try{
        const response = await cadastroBanco(banco as Banco);
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
        const response = await updateBanco(banco as changeBanco);
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
            duplicate: error?.duplicate
        })
    }
})



