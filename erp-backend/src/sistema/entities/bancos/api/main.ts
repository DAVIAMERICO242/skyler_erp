import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';

export const bancos_router = Router();

bancos_router.get('/cadastro',(req:RequestModel,res:Response)=>{
    res.status(200).send('hello bancos');
})