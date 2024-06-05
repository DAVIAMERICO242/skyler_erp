/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useState } from "react";
import { useTerceiros } from "../../Terceiros/Terceiros";
import { useLojas } from "../../Lojas/Lojas";
import { useBancos } from "../../Bancos/Bancos";
import { Excel } from "@/sistema/essentials";
import { useContas } from "../../Contas/local-contexts/contas-context";
import { TZtoFriendlyDate } from "@/sistema/essentials";
import { useToast } from "@/components/ui/use-toast";

export const Exportar = ({author}:{author:string})=>{
    const { toast } = useToast()
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
      toast({
        title: "Sucesso",
        className: "success",
        description: "EXPORTAÇÃO BEM SUCEDIDA",
      });
    }
  
    return(
      <LoadingButton onClick={()=>{submit()}} loading={loading} type="neutral" className="w-3/5">
          Exportar tudo
      </LoadingButton>
    )
  }