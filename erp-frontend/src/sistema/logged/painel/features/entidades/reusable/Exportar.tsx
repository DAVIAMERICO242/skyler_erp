import { LoadingButton } from "@/components/ui/LoadingButton";
import { FC } from 'react';
import { useState } from "react";
import { useTerceiros } from "../Terceiros/Terceiros";
import { useLojas } from "../Lojas/Lojas";
import { useBancos } from "../Bancos/Bancos";
import { Excel } from "@/sistema/essentials";
import { Author } from "./Gerenciar";

export const Exportar:FC<Author> = ({author})=>{
    const [loading,setLoading] = useState<boolean>(false);
    switch (author){
      case "terceiros":
        var {data} = useTerceiros();
        var excel_name = "terceiros_cadastrados.xlsx"
        break;
      case "lojas":
        var {data} = useLojas();
        var excel_name = "lojas_cadastradas.xlsx"
        break;
      case "bancos":
        var {data} = useBancos();
        var excel_name = "bancos_cadastrados.xlsx"
        break;
    }
    const submit = ()=>{
      setLoading(true);
      Excel(data,excel_name);
      setLoading(false);
    }
  
    return(
      <LoadingButton onClick={()=>{submit()}} loading={loading} type="skyler" className="w-3/5">
        Exportar
      </LoadingButton>
    )
  }