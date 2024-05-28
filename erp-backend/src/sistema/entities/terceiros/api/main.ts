import {Router, Response} from 'express';
import { RequestModel } from '../../../schemas/this-api/schemas';

export const terceiros_router = Router();

terceiros_router.get('/cadastro',(req:RequestModel,res:Response)=>{
    res.status(200).send('hello world');
})