import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ContasForm } from "./ContasForm";

import {FC} from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import BACKEND_URL from '@/sistema/backend-urls';
import { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";

export const NovoTipoFiscalDialog = ({categorias} : {categorias: string[]})=>{
    const [open,setOpen] = useState<boolean>(false);

    const novoTipoFiscal = ()=>{
        console.log('oi')
     }
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <div onClick={novoTipoFiscal} style={{display:"flex",alignItems:"center",userSelect:"none",cursor:"pointer",height:"100%",fontSize:"13px",padding:'5px 10px' ,borderRadius: '3px', backgroundColor:'var(--deep-white)', color:"var(--skyler-blue)" }}>Novo</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Cadastrar tipo fiscal</DialogTitle>
            </DialogHeader>
            <NovoTipoFiscalForm categorias={categorias}/>
        </DialogContent>
        </Dialog>
    )
}

const NovoTipoFiscalForm = ({categorias} : {categorias: string[]})=>{
    const [loading, setLoading] = useState(false);
    const [category,setCategory] = useState("");
    const [newTipo, setNewTipo] = useState("");
    const { toast } = useToast();


   function submit(){
            if(!newTipo || !category){
                alert("Dados inválidos")
            }
            setLoading(true);
            fetch(BACKEND_URL+`/categorias_fiscais/cadastro`,{
                method:"POST",
                headers:{
                  'Content-type':"application/json",
                  'token':localStorage.getItem('token') as string,
                },
                body:JSON.stringify({tipo_conta:{
                    categoria:category,
                    nome_tipo:newTipo
                }})
              }).then((d)=>d.json())
                .then((d)=>{
                  if(d.success){
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
                .catch(()=>{
                  toast({
                    title: "Erro desconhecido",
                    className: "error",
                    description: "Comunique ao desenvolvedor",
                  })
                  setLoading(false);
                })
            
            console.log({
                category,
                newTipo
            })
   }

    return(
        <>
            <Select onValueChange={(value) => {setCategory(value)}}>
                <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Escolha a categoria fiscal"/>
                </SelectTrigger>
                <SelectContent>
                    {categorias?.map((e)=>{
                        return(
                            <SelectItem value={e}>
                                {!e.trim().toLocaleLowerCase().includes('outro')?((parseInt(e.trim().slice(0,2))<=2)?(`${e} (receber)`):(`${e} (pagar)`)):e}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
                <Input placeholder="nome do tipo fiscal" onChange={(e)=>{setNewTipo(e.currentTarget.value.trim())}}/>
                <LoadingButton onClick={()=>submit()} loading={loading} type="neutral">
                    Pronto
                </LoadingButton>
            </Select>
        
        </>
    )
}