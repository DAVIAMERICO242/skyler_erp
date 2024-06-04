import { LoadingButton } from "@/components/ui/LoadingButton";
import { FC } from 'react';
import { useState } from "react";
import { useTerceiros } from "../Terceiros/Terceiros";
import { useLojas } from "../Lojas/Lojas";
import { useBancos } from "../Bancos/Bancos";
import { Excel } from "@/sistema/essentials";
import { Author } from "./Gerenciar";
import { useContas } from "../Contas/local-contexts/contas-context";
import { TZtoFriendlyDate } from "@/sistema/essentials";

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
      case "contas":
          var data = useContas().data?.map((e)=>{
            return{
              'id':e.id,
              'Lançamento': TZtoFriendlyDate(e.data),
              'Vencimento':TZtoFriendlyDate(e.vencimento),
              'Tipo fiscal':e.conta_tipo,
              'Terceiro':e.terceiro,
              'Valor (R$)':e.valor
            }
          });
          var excel_name = "historico_pagar_receber.xlsx"
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