import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";

import { TerceirosForm } from "../../Terceiros/TerceirosForm";
import { LojasForm } from "../../Lojas/LojasForm";
import { BancosForm } from "../../Bancos/BancosForm";
import { ContasForm } from "../../Contas/ContasForm";


export const CriarEditar = ({author, edit, identifier_value}:{author:string, edit:boolean, identifier_value?:string})=>{

  const [open,setOpen] = useState<boolean>(false);

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          {!edit?(
            <LoadingButton loading={false} type={!edit?"skyler":"neutral"} className="w-3/5">
              {!edit?"+ Novo":"Editar"}
            </LoadingButton>
          ):(<button>Editar</button>)
          }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{!edit?"Cadastrar":"Editar"} {author}</DialogTitle>
        </DialogHeader>
          {author==="terceiros" && <TerceirosForm identifier_value={identifier_value} edit={edit} setOpen={setOpen}/>}
          {author==="lojas" && <LojasForm identifier_value={identifier_value} edit={edit} setOpen={setOpen}/>}
          {author==="bancos" && <BancosForm identifier_value={identifier_value} edit={edit} setOpen={setOpen}/>}
          {author==="contas" && <ContasForm identifier_value={identifier_value} edit={edit} setOpen={setOpen}/>}
      </DialogContent>
    </Dialog>
  )
  }