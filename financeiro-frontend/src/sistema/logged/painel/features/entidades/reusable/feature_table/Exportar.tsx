/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useState } from "react";
import { useTerceiros } from "../../Terceiros/Terceiros";
import { useLojas } from "../../Lojas/Lojas";
import { useBancos } from "../../Bancos/Bancos";
import { Excel, isStringDate } from "@/sistema/essentials";
import { useContas } from "../../Contas/local-contexts/contas-context";
import { TZtoFriendlyDate } from "@/sistema/essentials";
import { useToast } from "@/components/ui/use-toast";
import { useFilteredData } from "./filter/FilterContexts";
import { useTableFilter } from "./filter/FilterContexts";
import { areAllValuesEmptyArrays } from "@/sistema/essentials";
import { getUIColumnName } from "../../BackendHelper/formatBackendData/getUIColumnName";
import { getAllContas } from "../../BackendHelper/API/fetch";
import { OrbitIcon } from "lucide-react";

export const Exportar = ({author}:{author:string})=>{
    const { toast } = useToast()
    const [loading,setLoading] = useState<boolean>(false);
    var {filteredData} = useFilteredData();

    var {dataFilter} = useTableFilter();

    var filteredDataUINames = [];

    filteredData?.map((e)=>{
       var current_obj = {};
       for (let column of Object.keys(e)){
          current_obj[getUIColumnName(author,column) as string] = e[column]
       }

       filteredDataUINames.push(current_obj);
    })

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
          var excel_name = "historico_pagar_receber.xlsx"
          break;
    }
    const submit = ()=>{
      setLoading(true);
      if(author!=="contas"){
        Excel(filteredDataUINames,excel_name);
        setLoading(false);
        toast({
          title: "Sucesso",
          className: "success",
          description: "EXPORTAÇÃO BEM SUCEDIDA",
        });
      }else{
        var filteredDataUINames = []
        getAllContas().then((d)=>{
          d?.data?.map((e)=>{
            var current_obj = {};
            for (let column of Object.keys(e)){
               current_obj[getUIColumnName(author,column) as string] = e[column]?(isStringDate(e[column])?TZtoFriendlyDate(e[column]):e[column]):("Desconhecido")
            }
     
            filteredDataUINames.push(current_obj);
         })
          Excel(filteredDataUINames,excel_name);
          setLoading(false);
          toast({
            title: "Sucesso",
            className: "success",
            description: "EXPORTAÇÃO BEM SUCEDIDA",
          });
        })
      }
    }
  
    return(
      <LoadingButton onClick={()=>{submit()}} loading={loading} type="neutral" className="w-3/5">
          Exportar 
      </LoadingButton>
    )
  }