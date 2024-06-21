import {Router, Response} from 'express';
import { DBError, RequestModel, grupoContasDB, newGrupoContas, newTipoContasSchema } from '../../../schemas/this-api/schemas';
import { cadastroGrupoConta, getGrupoContas } from './grupoContasDB';

export const grupo_contas_router = Router();

grupo_contas_router.post('/grupo_contas',async (req:RequestModel,res:Response)=>{
    try{
        const {novo_grupo} = req.body;
        const response = await cadastroGrupoConta(novo_grupo as newGrupoContas) as {id:number};
        res.status(200).send({
            success:true,
            data:response?.id
        })
    }catch(error:any){
        res.status(400).send({
            success:false,
            duplicate: error?.duplicate
        })
    }
});

grupo_contas_router.get('/grupo_contas',async (req:RequestModel,res:Response)=>{
    try{
        const {novo_grupo} = req.body;
        const response = await getGrupoContas() as grupoContasDB[];
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
