import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useState } from "react";

import { TerceirosForm } from "./TerceirosForm";

export const EditTerceiros = ()=>{
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
            <DialogTitle>Editar terceiros</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
            <TerceirosForm edit={true} setOpen={setOpen}/>
        </DialogContent>
      </Dialog>
    )
  }