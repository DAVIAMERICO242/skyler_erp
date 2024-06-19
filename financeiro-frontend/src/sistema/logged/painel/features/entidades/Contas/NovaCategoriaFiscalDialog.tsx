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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useContas } from "./local-contexts/contas-context";
import { useCategoriasFiscais } from "./local-contexts/categorias_fiscais-context";

export const NovaCategoriaFiscalDialog = ({categorias, setSignalUpdateUIAfterNewTipo} : {categorias: string[], setSignalUpdateUIAfterNewTipo:any})=>{
    const [open,setOpen] = useState<boolean>(false);

    const novaCategoriaFiscal = ()=>{
        console.log('oi')
     }

    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <div onClick={novaCategoriaFiscal} style={{display:"flex",alignItems:"center",userSelect:"none",cursor:"pointer",height:"100%",fontSize:"13px",padding:'5px 10px' ,borderRadius: '3px', backgroundColor:'var(--deep-white)', color:"var(--skyler-blue)" }}>Novo</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Cadastrar categoria fiscal</DialogTitle>
            </DialogHeader>
            <NovaCategoriaFiscalForm categorias={categorias} setSignalUpdateUIAfterNewTipo={setSignalUpdateUIAfterNewTipo}/>
        </DialogContent>
        </Dialog>
    )
}

const NovaCategoriaFiscalForm = ({categorias, setSignalUpdateUIAfterNewTipo} : {categorias: string[],setSignalUpdateUIAfterNewTipo:any})=>{
    const refetch_categorias = useCategoriasFiscais().refetch;
    const refetch_contas = useContas().refetch
    const [loading, setLoading] = useState(false);
    const [category,setCategory] = useState("");
    const [tipo, setTipo] = useState<"pagar"|"receber"|"">("");
    const { toast } = useToast();

   function submit(){
            if(!tipo || !category){
                alert("Dados inválidos")
                return
            }
            setLoading(true);
            fetch(BACKEND_URL+`/categorias_fiscais/cadastro`,{
                method:"POST",
                headers:{
                  'Content-type':"application/json",
                  'token':localStorage.getItem('token') as string,
                },
                body:JSON.stringify(
                    {new_category:{
                        nome:category,
                        tipo:tipo
                    }})
              }).then((d)=>d.json())
                .then((d)=>{
                  if(d.success){
                    refetch_contas();
                    refetch_categorias();
                    setSignalUpdateUIAfterNewTipo((prev:number)=>-1*prev);
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
            
   }

    return(
        <>
            <Select onValueChange={(value) => {setTipo(value)}}>
                <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Pagar ou receber?"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"pagar"}>
                        Pagar
                    </SelectItem>
                    <SelectItem value={"receber"}>
                        Receber
                    </SelectItem>
                </SelectContent>
            </Select>
            <Input placeholder="nome da categoria" onChange={(e)=>{setCategory(e.currentTarget.value.trim())}}/>
            <LoadingButton onClick={()=>submit()} loading={loading} type="neutral">
                Pronto
            </LoadingButton>
        
        </>
    )
}