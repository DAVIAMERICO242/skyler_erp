import {Router, Response} from 'express';
import { DBError, RequestModel } from '../../../schemas/this-api/schemas';
import { LojaFrontendFormInput } from '../../../schemas/this-api/schemas';
import { cadastroLoja } from '../database/lojasDB';
import { getLojas } from '../database/lojasDB';
import { updateLoja } from '../database/lojasDB';
import { changeLojaFrontendFormInput } from '../../../schemas/this-api/schemas';
import { deleteLoja } from '../database/lojasDB';

export const lojas_router = Router();

lojas_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {loja} = req.body;
    try{
        const response = await cadastroLoja(loja as LojaFrontendFormInput);
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

lojas_router.get('/get',async (req:RequestModel,res:Response)=>{
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
        const response = await updateLoja(loja as changeLojaFrontendFormInput);
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
            foreign_key: error?.foreign_key,
            duplicate: error?.duplicate
        })
    }
})