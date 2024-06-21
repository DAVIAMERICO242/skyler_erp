/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
import { LoadingButton } from "@/components/ui/LoadingButton";

import { useToast } from "@/components/ui/use-toast"
import BACKEND_URL from '@/sistema/backend-urls';
import { useState } from 'react';

import { Input } from "@/components/ui/input";
import { UseGrupoContas } from "./local-contexts/grupo_contas-context";


export const NovoGrupoContasDialog = ()=>{

    const [open,setOpen] = useState<boolean>(false);
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <div style={{display:"flex",alignItems:"center",userSelect:"none",cursor:"pointer",height:"100%",fontSize:"13px",padding:'5px 10px' ,borderRadius: '3px', backgroundColor:'var(--deep-white)', color:"var(--skyler-blue)" }}>Novo</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Cadastrar grupo de contas</DialogTitle>
            </DialogHeader>
            <NovoGrupoContasDialogForm open={open} setOpen={setOpen}/>
        </DialogContent>
        </Dialog>
    )
}

const NovoGrupoContasDialogForm = ({open,setOpen})=>{
    const [loading, setLoading] = useState(false);
    const [grupo,setGrupo] = useState("");
    const { toast } = useToast();
    const refetchGrupos = UseGrupoContas()?.fetchGrupos;

   function submit(){
            if(!grupo){
                alert("Dados inválidos")
                return
            }
            setLoading(true);
            fetch(BACKEND_URL+`/grupo_contas`,{
                method:"POST",
                headers:{
                  'Content-type':"application/json",
                  'token':localStorage.getItem('token') as string,
                },
                body:JSON.stringify(
                    {novo_grupo:{
                        nome_grupo:grupo,
                    }})
              }).then((d)=>d.json())
                .then((d)=>{
                  if(d.success){
                    setOpen(false);
                    refetchGrupos();
                    // refetch_contas();
                    // refetch_categorias();
                    toast({
                      title: "Sucesso",
                      className: "success",
                      description: "Ocorreu tudo certo com a operação",
                    })
                    setLoading(false);
                  }else{
                    if(d.duplicate){
                      console.log('duplicata')
                      toast({
                        title: "Duplicata",
                        className: "error",
                        description: "Esse nome já existe no banco de dados",
                      })
                    }
                    else{
                      toast({
                        title: "Erro desconhecido",
                        className: "error",
                        description: "Comunique ao desenvolvedor",
                      })
                    }
                    setLoading(false);
                  }
                })
                .catch((err)=>{
                  console.log(err)
                  toast({
                    title: "Erro desconhecido",
                    className: "error",
                    description: "Comunique ao desenvolvedor",
                  })
                  setLoading(false);
                })
            
   }

    return(
        <>
            <Input placeholder="nome do grupo" onChange={(e)=>{setGrupo(e.currentTarget.value.trim())}}/>
            <LoadingButton onClick={()=>submit()} loading={loading} type="neutral">
                Pronto
            </LoadingButton>
        
        </>
    )
}