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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";

export const EditTerceiros = ()=>{

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
            <LoadingButton onClick={()=>{}} loading={false} type="neutral" className="w-3/5">
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <LoadingButton onClick={()=>{submit()}} loading={loading} type="neutral" className="w-3/10">
                  Pronto
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }