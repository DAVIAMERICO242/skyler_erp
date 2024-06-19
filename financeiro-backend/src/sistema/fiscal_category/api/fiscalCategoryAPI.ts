import {Router, Response} from 'express';
import { DBError, RequestModel, newTipoContasSchema } from '../../schemas/this-api/schemas';
import { getTipoContas, newIndexedCategory, newTipoContas } from '../database/fiscalCategoryDB';
import { sortFiscalCategory } from '../../essentials';
import { DBTipoContas } from '../../schemas/this-api/schemas';

export const fiscal_category_router = Router();

fiscal_category_router.get('/get',async (req:RequestModel,res:Response)=>{
    try{
        const response = await getTipoContas();
        res.status(200).send({
            success:true,
            data:sortFiscalCategory(response as DBTipoContas[])
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});

fiscal_category_router.post('/cadastro',async (req:RequestModel,res:Response)=>{
    const {tipo_conta} = req.body;
    try{
        if(!req.body?.new_category){
            const response = await newTipoContas(tipo_conta as newTipoContasSchema);
        }else{
            const new_category = req.body.new_category as {tipo:("pagar"|"receber"),nome:string};
            const response = await newIndexedCategory(new_category);
        }
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