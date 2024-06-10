import {Router, Response} from 'express';
import { RequestModel, contaToBeResolved } from '../../../schemas/this-api/schemas';
import { cadastroHistoricoConta, deleteHistoricoConta, getFrotendHistoricoConta, getNumberOfPages, resolverConta } from '../database/contasDB';
import { HistoricoContas } from '../../../schemas/this-api/schemas';
import { updateHistoricoConta } from '../database/contasDB';
import { changeHistoricoContas } from '../../../schemas/this-api/schemas';

export const contas_router = Router();


contas_router.post('/resolver',async (req:RequestModel,res:Response)=>{
    const {conta} = req.body;
    try{
        const response = await resolverConta(conta as  contaToBeResolved);
        res.status(200).send({
            success:true,
            state:response
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})

contas_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {conta} = req.body;
    try{
        const response = await cadastroHistoricoConta(conta as  HistoricoContas);
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

contas_router.get('/get',async (req:RequestModel,res:Response)=>{
    try{
        const page = req.query?.page;
        const page_size = 2;
        const response = await getFrotendHistoricoConta(parseInt(page as string),page_size);//page=x,page_size = 1
        const n_pages = await getNumberOfPages(page_size);
        res.status(200).send({
            success:true,
            data:response,
            n_pages:n_pages
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})

contas_router.post('/update',async (req:RequestModel,res:Response)=>{
    const {conta} = req.body;
    try{
        const response = await updateHistoricoConta(conta as changeHistoricoContas);
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

contas_router.post('/delete',async (req:RequestModel,res:Response)=>{
    const {conta} = req.body;
    try{
        const response = await deleteHistoricoConta(conta as number);
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



