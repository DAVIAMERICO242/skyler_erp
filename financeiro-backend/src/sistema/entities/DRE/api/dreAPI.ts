import {Router, Response} from 'express';
import { DBError, RequestModel, newTipoContasSchema, requestedDRE, requestedDREContaCategory } from '../../../schemas/this-api/schemas';
import { DBTipoContas } from '../../../schemas/this-api/schemas';
import { dreController, getCategoryDetailsController } from '../database/dreDB';


export const dre_router = Router();

dre_router.post('/dre',async (req:RequestModel,res:Response)=>{
    const {dre_request} = req.body;

    try{
        const response = await dreController(dre_request as unknown as requestedDRE);
        res.status(200).send({
            success:true,
            data: response
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});

dre_router.post('/dre_category_detail',async (req:RequestModel,res:Response)=>{

    const {category_request} = req.body;//tem o filtro

    try{
        const response = await getCategoryDetailsController(category_request as unknown as requestedDREContaCategory);
        res.status(200).send({
            success:true,
            data: response
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
})