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
  import { ContasForm } from "./ContasForm";




export const NovoTipoFiscalDialog = ()=>{
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
            <DialogTitle>Editar Histórico de Contas</DialogTitle>
            <DialogDescription>
                Essa ação é irreversível
            </DialogDescription>
            </DialogHeader>
            <ContasForm edit={true} setOpen={setOpen}/>
        </DialogContent>
        </Dialog>
    )
  }