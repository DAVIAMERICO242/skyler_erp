
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

export const Delete:FC<Author> = ({author})=>{


    switch (author){
      case "terceiros":
        var {data} = useTerceiros();
        var excel_name = "terceiros_cadastrados.xlsx"
        var identifier = "nome";
        break;
      case "lojas":
        var {data} = useLojas();
        var excel_name = "lojas_cadastradas.xlsx"
        var identifier = "nome";
        break;
      case "bancos":
        var {data} = useBancos();
        var excel_name = "bancos_cadastrados.xlsx";
        var identifier = "conta";
        break;
    }
  
  
    const [loading,setLoading] = useState<boolean>(false);
    const [open,setOpen] = useState<boolean>(false);
  
    const submit = ()=>{
      setLoading(true);
      setOpen(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 3000);
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
            <DialogTitle>Deletar</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {identifier}
              </Label>
              <Select onValueChange={(value) => { }}>
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
              <LoadingButton onClick={()=>{submit()}} loading={loading} type="destructive" className="w-3/10">
                    Deletar
              </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }