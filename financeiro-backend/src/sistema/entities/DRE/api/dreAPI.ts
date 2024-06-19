import {Router, Response} from 'express';
import { DBError, RequestModel, newTipoContasSchema, requestedDRE } from '../../../schemas/this-api/schemas';
import { DBTipoContas } from '../../../schemas/this-api/schemas';
import { dreController } from '../database/dreDB';


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