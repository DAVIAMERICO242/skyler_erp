import {Router, Response} from 'express';
import { DBHistoricoContas, RequestModel, contaToBeResolved } from '../../../schemas/this-api/schemas';
import { cadastroHistoricoConta, deleteHistoricoConta, getFilteredFrotendHistoricoConta, getFrotendHistoricoConta, getNumberOfPages, resolverConta } from '../database/contasDB';
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

contas_router.post('/get',async (req:RequestModel,res:Response)=>{
    try{    
        const page = req.query?.page;
        const filter = req.body?.filter;
        const page_size = 100;

        let response;

        if(filter){
            response = await getFilteredFrotendHistoricoConta(filter, parseInt(page as string),page_size) as {data:DBHistoricoContas[],n_pages:number};//page=x,page_size = 1
        }else{
            response = await getFrotendHistoricoConta(parseInt(page as string),page_size) as {data:DBHistoricoContas[],n_pages:number};//page=x,page_size = 1
        }
        
        res.status(200).send({
            success:true,
            data:response.data,
            n_pages:response.n_pages
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



