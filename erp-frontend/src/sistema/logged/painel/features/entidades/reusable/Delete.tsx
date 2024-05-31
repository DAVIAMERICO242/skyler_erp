
import { LoadingButton } from "@/components/ui/LoadingButton";
import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTerceiros } from "../Terceiros/Terceiros";
import { useLojas } from "../Lojas/Lojas";
import { useBancos } from "../Bancos/Bancos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Author } from "./Gerenciar";
import { firstCharUpper } from "@/sistema/essentials";
import { singularWord } from "@/sistema/essentials";
import { useToast } from "@/components/ui/use-toast"
import BACKEND_URL from "@/sistema/backend-urls";

export const Delete:FC<Author> = ({author})=>{

    const { toast } = useToast();
    switch (author){
      case "terceiros":
        var {data} = useTerceiros();
        var {refetch} = useTerceiros();
        var excel_name = "terceiros_cadastrados.xlsx"
        var identifier = "nome";
        break;
      case "lojas":
        var {data} = useLojas();
        var {refetch} = useLojas();
        var excel_name = "lojas_cadastradas.xlsx"
        var identifier = "nome";
        break;
      case "bancos":
        var {data} = useBancos();
        var {refetch} = useBancos();
        var excel_name = "bancos_cadastrados.xlsx";
        var identifier = "conta";
        break;
    }

    const [toBeDeleted, setToBeDeleted] = useState<string>("");
  
    const [loading,setLoading] = useState<boolean>(false);
    const [open,setOpen] = useState<boolean>(false);

    const manageSelectChange = (value)=>{
        console.log('A SER DELETADO')
        console.log(value)
        setToBeDeleted(value)
    }
  
    function submit() {
        console.log('form');
        setLoading(true);
        fetch(BACKEND_URL+`/${author}/delete`,{
          method:"POST",
          headers:{
            'Content-type':"application/json",
            'token':localStorage.getItem('token') as string,
          },
          body:JSON.stringify({[singularWord(author)]:toBeDeleted})
        }).then((d)=>d.json())
          .then((d)=>{
            if(d.success){
              refetch();
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
                  description: "Esse nome ou conta bancária já existe no banco de dados",
                })
              }else if(d.foreign_key){
                toast({
                  title: "GENERIC FOREIGN KEY ERROR",
                  className: "error",
                  description: "Esse erro provavelmente foi gerado porque você tentou excluir uma conta bancária relacionada a uma loja",
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <LoadingButton onClick={()=>{}} loading={false} type="destructive" className="w-3/5">
              Deletar
          </LoadingButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
                {"Deletar " + singularWord(author)}
            </DialogTitle>
            <DialogDescription>
                Essa ação é irreversível
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {firstCharUpper(identifier)}
              </Label>
              <Select onValueChange={(value) => {manageSelectChange(value)}}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Escolher"/>
                </SelectTrigger>
                <SelectContent>
                    {data?.map((e)=>{
                        return (
                            <SelectItem value={e[identifier] as string}>{e[identifier]}</SelectItem>
                        )
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
              <LoadingButton onClick={submit} loading={loading} type="destructive" className="w-3/10">
                    Deletar
              </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }