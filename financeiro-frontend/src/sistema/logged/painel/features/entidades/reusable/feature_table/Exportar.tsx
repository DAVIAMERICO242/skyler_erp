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
import { useFilteredData } from "./filter/FilterContexts";
import { useTableFilter } from "./filter/FilterContexts";
import { areAllValuesEmptyArrays } from "@/sistema/essentials";

export const Exportar = ({author}:{author:string})=>{
    const { toast } = useToast()
    const [loading,setLoading] = useState<boolean>(false);
    var {filteredData} = useFilteredData();

    var {dataFilter} = useTableFilter();

    var check_is_a_filter= !areAllValuesEmptyArrays(dataFilter);

    console.log('DATA FILTER EM EXPORTAR');
    console.log(dataFilter);
    
    switch (author){
      case "terceiros":
        var excel_name = "terceiros_cadastrados.xlsx"
        break;
      case "lojas":
        var excel_name = "lojas_cadastradas.xlsx"
        break;
      case "bancos":
        var excel_name = "bancos_cadastrados.xlsx"
        break;
      case "contas":
        var filteredData = filteredData?.map((e)=>{
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
      Excel(filteredData,excel_name);
      setLoading(false);
      toast({
        title: "Sucesso",
        className: "success",
        description: "EXPORTAÇÃO BEM SUCEDIDA",
      });
    }
  
    return(
      <LoadingButton onClick={()=>{submit()}} loading={loading} type="neutral" className="w-3/5">
          Exportar {check_is_a_filter?"Filtro":""}
      </LoadingButton>
    )
  }