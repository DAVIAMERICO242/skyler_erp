import { LoadingButton } from "@/components/ui/LoadingButton";
import { FC } from 'react';
import { LoadingButtonProps } from "@/components/ui/LoadingButton";
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
import { useState } from "react";

interface Author{
  author: "terceiros"|"lojas"|"bancos"//ditará as requisições http e modelo de editar
}
const EditTerceiros = ()=>{

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

const EditLojas = ()=>{
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
          <DialogTitle>Editar lojas</DialogTitle>
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

const EditBancos = ()=>{
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
          <DialogTitle>Editar Bancos</DialogTitle>
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

const Exportar:FC<Author> = ({author})=>{
  const [loading,setLoading] = useState<boolean>(false);

  const submit = ()=>{
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }
  return(
    <LoadingButton onClick={()=>{submit()}} loading={loading} type="skyler" className="w-3/5">
      Exportar
    </LoadingButton>
  )
}

const Delete:FC<Author> = ({author})=>{
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
            <LoadingButton onClick={()=>{submit()}} loading={loading} type="destructive" className="w-3/10">
                  Deletar
            </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Gerenciar:FC<Author> = ({author}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2.5" style={{ border: 'var(--light-border)', padding: '1rem',borderRadius:"8px"}}>
      {author === "terceiros" ? <EditTerceiros /> : null}
      {author === "lojas" ? <EditLojas /> : null}
      {author === "bancos" ? <EditBancos /> : null}
      <Exportar author={author}/>
      <Delete author={author}/>
    </div>
  );
};
