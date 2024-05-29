import {Router, Response} from 'express';
import { DBError, RequestModel } from '../../../schemas/this-api/schemas';
import { cadastroTerceiro } from '../database/terceirosDB';
import { Terceiro } from '../../../schemas/this-api/schemas';
import { getTerceiros } from '../database/terceirosDB';
import { updateTerceiro } from '../database/terceirosDB';
import { changeTerceiro } from '../../../schemas/this-api/schemas';
import { deleteTerceiro } from '../database/terceirosDB';

export const terceiros_router = Router();

terceiros_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {terceiro} = req.body;
    try{
        const response = await cadastroTerceiro(terceiro as Terceiro);
        res.status(200).send({
            success:true
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});

terceiros_router.get('/get',async (req:RequestModel,res:Response)=>{
    try{
        const response = await getTerceiros();
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
});

terceiros_router.post('/update',async (req:RequestModel,res:Response)=>{
    const {terceiro} = req.body;
    try{
        const response = await updateTerceiro(terceiro as changeTerceiro);
        res.status(200).send({
            success:true
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});

terceiros_router.post('/delete',async (req:RequestModel,res:Response)=>{
    const {terceiro} = req.body;
    try{
        const response = await deleteTerceiro(terceiro as string);
        res.status(200).send({
            success:true
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});