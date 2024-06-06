/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import styled from "styled-components"
import { TableBar } from "./TableBar";
import { useEffect, useState } from "react";
import { useLojas } from "../../Lojas/Lojas";
import { useTerceiros } from "../../Terceiros/Terceiros";
import { useBancos } from "../../Bancos/Bancos";
import { useContas } from "../../Contas/local-contexts/contas-context";
import { CriarEditar } from "./CriarEditar";
import { Deletar } from "./Deletar";
import { FilterDialog } from "./filter/FilterDialog";
import { useFilteredData, useTableFilter } from "./filter/FilterContexts";
import { TableFilterProvider } from "./filter/FilterContexts";
import { FilteredDataProvider } from "./filter/FilterContexts";
import { FaLessThanEqual } from "react-icons/fa";

const TableContainer = styled.div`
    padding:30px;
    opacity:0;
    transform: translateY(50px);
    animation: fadeIn 0.5s ease forwards;
    min-width:fit-content;
`

const Table = styled.table`
    width:100%;
    border:var(--light-border);
`

const TableHeader = styled.tr`
    user-select:none;
    background-color: var(--skyler-blue);
    color:white;
`;

const TableRow = styled.tr`
    background-color:white;
`

const TableHeaderValue = styled.th`
        padding:10px;
        font-size:15px;
        font-weight:500;
`
const TableRowValue = styled.td`
        border: var(--light-border);
        padding:10px;
        font-size:13px;
        text-align:center;
        &:hover{
            background-color:#f7f3f3;
        }
`

export const FeatureTable = ({author}:{author:string})=>{

    return(
        <FilteredDataProvider>
            <TableFilterProvider>
                <FeatureTableUI author={author}/>
            </TableFilterProvider>
        </FilteredDataProvider>
    )
    
}

const FeatureTableUI = ({author}:{author:string})=>{
    const [filteredKey,setFilteredKey] = useState("");

    const terceiros_data = useTerceiros().data;
    const terceiros_refetch = useTerceiros().refetch;
    const lojas_data = useLojas().data;
    const lojas_refetch = useLojas().refetch;
    const bancos_data = useBancos().data;
    const bancos_refetch = useBancos().refetch;
    const contas_data = useContas().data;
    const contas_refetch = useContas().refetch


    switch (author){
        case "terceiros":
          var data = terceiros_data;
          var refetch = terceiros_refetch;
          var excel_name = "terceiros_cadastrados.xlsx"
          var identifier = "nome";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "lojas":
          var data = lojas_data;
          var refetch = lojas_refetch;
          var excel_name = "lojas_cadastradas.xlsx"
          var identifier = "nome";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "bancos":
          var data = bancos_data;
          var refetch = bancos_refetch;
          var excel_name = "bancos_cadastrados.xlsx";
          var identifier = "conta";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "contas":
          var data = contas_data;
          var refetch = contas_refetch;
          var excel_name = "historico_pagar_receber.xlsx";
          var identifier = "id";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        default:
          var data = [];
          var identifier = "";
          var columns:string[] = [];
      }

    const dataFilter = useTableFilter().dataFilter;
    const filteredData = useFilteredData().filteredData;
    const setFilteredData = useFilteredData().setFilteredData;

    useEffect(()=>{
        const filtered = data?.filter((data_row)=>{
            if(dataFilter){
                for (let column of Object.keys(data_row)){
                    if(!dataFilter[column]?.length){
                        continue;
                    }else{
                        if(!dataFilter[column].includes(data_row[column])){
                            return false;
                        }
                    }
                }
                return true;//nao foi barrado
            }else{
                return true;
            }
        })
        setFilteredData(filtered)
    },[dataFilter])



    console.log('FILTERED DATA');
    console.log(filteredData);

    return(
        <TableContainer className="table_container">
            <TableBar filteredKey={filteredKey} setFilteredKey={setFilteredKey} author={author}/>
            <Table>
                <TableHeader>
                    {columns?.map((e)=>{
                        return(
                            <>
                                <TableHeaderValue className="table_header_value" key={e}>
                                    <div className="flex items-center justify-center gap-[25px]">
                                        <div>
                                            {e} 
                                        </div>
                                        <FilterDialog data={data} column={e}/>
                                    </div>
                                </TableHeaderValue>                   
                            </>
                        )
                    })}
                    <TableHeaderValue>Gerenciar</TableHeaderValue>                   
                </TableHeader>
                {data?.filter((data_row)=>{
                    if(dataFilter){
                        for (let column of Object.keys(data_row)){
                            if(!dataFilter[column]?.length){
                                continue;
                            }else{
                                if(!dataFilter[column].includes(data_row[column])){
                                    return false;
                                }
                            }
                        }
                        return true;//nao foi barrado
                    }else{
                        return true;
                    }
                }).map((row)=>{
                    return(
                        <TableRow id={row[identifier]}>
                            {columns?.map((column)=>{
                                return(
                                    <>
                                        <TableRowValue>{row[column]}</TableRowValue>
                                    </>
                                )
                            })}
                                <TableRowValue>
                                    <CriarEditar edit={true} author={author} identifier_value={row[identifier]}/>
                                    /
                                    <Deletar author={author} identifier_value={row[identifier]}/>
                                </TableRowValue>                   
                        </TableRow>
                    )
                })}
            </Table>
        </TableContainer>
    )
    
}


