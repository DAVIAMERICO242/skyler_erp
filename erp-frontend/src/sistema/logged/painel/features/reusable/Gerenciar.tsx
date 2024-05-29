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
import { EditTerceiros } from "../Terceiros/EditTerceiros";
import { EditLojas } from "../Lojas/EditLojas";
import { EditBancos } from "../Bancos/EditBancos";
import { useTerceiros } from "../Terceiros/Terceiros";
import { useLojas } from "../Lojas/Lojas";
import { useBancos } from "../Bancos/Bancos";
import { Excel } from "@/sistema/essentials";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Delete } from "./Delete";
import { Exportar } from "./Exportar";

export interface Author{
  author: "terceiros"|"lojas"|"bancos"//ditará as requisições http e modelo de editar
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
