import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';

export const lojas_router = Router();

lojas_router.get('/cadastro',(req:RequestModel,res:Response)=>{
    res.status(200).send('hello world lojas');
})