/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import { BRLReais, Excel } from "@/sistema/essentials";
import { useState } from "react";
import { useCharts } from "../chartsContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { TZtoFriendlyDate } from "@/sistema/essentials";

export const Exportar = ({author}:{author:string})=>{
    const [loading,setLoading] = useState<boolean>(false);
    const fullData = useCharts().chartData;
    const { toast } = useToast()
    switch (author){
        case "a_pagar_hoje":
          var excel_name = "a_pagar_hoje.xlsx";
          if(fullData){
              var chartData = fullData['a_pagar_hoje'].map((e)=>{
                return{
                    'ID': e.id,
                    'Vencimento': TZtoFriendlyDate(e.vencimento),
                    'Terceiro': e.terceiro,
                    'Valor necessário': e.valor,
                    'Valor pago': e.valor_resolucao,
                    'Restante': e.valor - e.valor_resolucao

                }
              })
          }
          break;
        case "a_receber_hoje":
          var excel_name = "a_receber_hoje.xlsx"
          if(fullData){
              var chartData = fullData['a_receber_hoje'].map((e)=>{
                return{
                    'ID': e.id,
                    'Vencimento': TZtoFriendlyDate(e.vencimento),
                    'Terceiro': e.terceiro,
                    'Valor necessário': e.valor,
                    'Valor pago': e.valor_resolucao,
                    'Restante': e.valor - e.valor_resolucao

                }
              })
          }
          break;
        case "pagar_vencidas":
          var excel_name = "pagar_vencidas.xlsx"
          if(fullData){
              var chartData = fullData['pagar_vencidas'].map((e)=>{
                return{
                    'ID': e.id,
                    'Vencimento': TZtoFriendlyDate(e.vencimento),
                    'Terceiro': e.terceiro,
                    'Valor necessário': e.valor,
                    'Valor pago': e.valor_resolucao,
                    'Restante': e.valor - e.valor_resolucao

                }
              })
          }
          break;
        case "receber_vencidas":
          var excel_name = "receber_vencidas.xlsx"
          if(fullData){
              var chartData = fullData['receber_vencidas'].map((e)=>{
                return{
                    'ID': e.id,
                    'Vencimento': TZtoFriendlyDate(e.vencimento),
                    'Terceiro': e.terceiro,
                    'Valor necessário': e.valor,
                    'Valor pago': e.valor_resolucao,
                    'Restante': e.valor - e.valor_resolucao
                }
              })
          }
          break;
    }
    const submit = ()=>{
        setLoading(true);
        Excel(chartData,excel_name);
        setLoading(false);
        toast({
            title: "Sucesso",
            className: "success",
            description: "EXPORTAÇÃO BEM SUCEDIDA",
          });
    }

    return(
        <Button onClick={()=>{submit()}} className="w-3/10 flex items-center justify-center gap-[10px]">
            Exportar
            <PiMicrosoftExcelLogoFill className="text-xl"/>
        </Button>
    )
}