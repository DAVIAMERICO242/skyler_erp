import {Router, Response} from 'express';
import { DBError, RequestModel } from '../../../schemas/this-api/schemas';
import { Loja } from '../../../schemas/this-api/schemas';
import { cadastroLoja } from '../database/lojasDB';
import { getLojas } from '../database/lojasDB';
import { updateLoja } from '../database/lojasDB';
import { changeLoja } from '../../../schemas/this-api/schemas';
import { deleteLoja } from '../database/lojasDB';

export const lojas_router = Router();

lojas_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await cadastroLoja(loja as Loja);
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

lojas_router.post('/get',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await getLojas();
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

lojas_router.post('/update',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await updateLoja(loja as changeLoja);
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

lojas_router.post('/delete',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await deleteLoja(loja as string);
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