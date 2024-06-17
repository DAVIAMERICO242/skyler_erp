import {Router, Response} from 'express';
import { DBError, RequestModel, newTipoContasSchema } from '../../schemas/this-api/schemas';
import { DBTipoContas } from '../../schemas/this-api/schemas';
import { resumoController } from './resumoDB';


export const resumo_router = Router();

resumo_router.get('/resumo',async (req:RequestModel,res:Response)=>{
    const {author} = req.query;

    try{
        const response = await resumoController(author as string);
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