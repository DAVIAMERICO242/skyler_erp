/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useState } from "react";
import { Excel, GroupContas, isStringDate } from "@/sistema/essentials";
import { TZtoFriendlyDate } from "@/sistema/essentials";
import { useToast } from "@/components/ui/use-toast";
import { useTableFilter } from "../reusable/feature_table/filter/FilterContextsNotContasExceptClean";
import { getUIColumnName } from "../BackendHelper/formatBackendData/getUIColumnName";
import { getAllContas } from "../BackendHelper/API/fetch";
import { useFilterContas } from "../reusable/feature_table/filter/contas/ContextFilterContas";

export const ExportarAgrupado = ()=>{
    const { toast } = useToast()
    const [loading,setLoading] = useState<boolean>(false);

    var {dataFilter} = useTableFilter();


    console.log('DATA FILTER EM EXPORTAR');
    console.log(dataFilter);
    
    var filter = useFilterContas().filterContas;
    var excel_name = "historico_pagar_agrupado.xlsx"

    const submit = ()=>{
      setLoading(true);
    var filteredDataUINames = []
    getAllContas(filter).then((d)=>d.json()).then((d)=>
        {
        d?.data?.map((e)=>{
        var current_obj = {};
        for (let column of Object.keys(e)){
            if(column==="id_grupo"){
                continue;
            }
            if(column==='nome_grupo'){
                current_obj[getUIColumnName("contas",column) as string] = `${e[column]} (cód: ${e['id_grupo']})`;
            }else{
            current_obj[getUIColumnName("contas",column) as string] = e[column]?(isStringDate(e[column])?TZtoFriendlyDate(e[column]):e[column]):(( column==='situacao'?"não resolvido":"Desconhecido"))
            }
        }
    
        filteredDataUINames.push(current_obj);
        })
        let grouped = GroupContas(filteredDataUINames);
        grouped = grouped.map((e)=>{
            return{
                'Situação':e['Situação'],
                'Lançamento':e['Lançamento'],
                'Vencimento':e['Vencimento'],
                'Competência':e['Competência'],
                'Previsão':e['Previsão'],
                'Data Transação':e['Data da Transação'],
                'Terceiro':e['Terceiro'],
                'Conta da vida real':e['Grupo Rateio'],
                'Categoria Fiscal':e['Categoria Fiscal'],
                'Tipo Fiscal': e['Tipo Fiscal'],
                'Pagar ou receber':e['Pagar ou receber'],
                'Valor da conta real':e['Valor da conta real'],
                'Transação total':e['Transação total']

            }
        })
        Excel(grouped,excel_name);
        console.log('DADOS EXPORTADOS');
        console.log(filteredDataUINames)
        setLoading(false);
        toast({
        title: "Sucesso",
        className: "success",
        description: "EXPORTAÇÃO BEM SUCEDIDA",
        });
    }
    ).catch((err)=>{
        alert("erro");
    })
      
    }
  
    return(
      <LoadingButton onClick={()=>{submit()}} loading={loading} type="neutral" className="w-3/5">
          Exportação agrupada
      </LoadingButton>
    )
  }