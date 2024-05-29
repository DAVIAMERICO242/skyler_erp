import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { LojasForm } from "./LojasForm";

export const EditLojas = ()=>{
  const [open,setOpen] = useState<boolean>(false);

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <LoadingButton loading={false} type="neutral" className="w-3/5">
                  Editar
          </LoadingButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Lojas</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
          <LojasForm edit={true} setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  )
  }