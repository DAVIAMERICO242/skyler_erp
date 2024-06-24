/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import styled from "styled-components"
import { TableBar } from "./TableBar";
import { useEffect, useState } from "react";
import { LojasProvider, useLojas } from "../../Lojas/Lojas";
import { useTerceiros } from "../../Terceiros/Terceiros";
import { useBancos } from "../../Bancos/Bancos";
import { useContas } from "../../Contas/local-contexts/contas-context";
import { CriarEditar } from "./CriarEditar";
import { Deletar } from "./Deletar";
import { FilterDialog } from "./filter/FilterDialogNotContas";
import { useFilteredData, useTableFilter } from "./filter/FilterContextsNotContasExceptClean";
import { TableFilterProvider } from "./filter/FilterContextsNotContasExceptClean";
import { FilteredDataNotContasProvider } from "./filter/FilterContextsNotContasExceptClean";
import { FaLessThanEqual } from "react-icons/fa";
import { CleanAllFilterProvider } from "./filter/FilterContextsNotContasExceptClean";
import { getUIColumnName } from "../../BackendHelper/formatBackendData/getUIColumnName";
import { BRLReais, isStringDate } from "@/sistema/essentials";
import { TZtoFriendlyDate } from "@/sistema/essentials";
import {  PaginationFeatureTable } from "./pagination/PaginationFeatureTable";
import { PaginationProvider } from "./pagination/PaginationContext";
import { Resolver } from "./pagamentos_logic/Resolver";
import { BancosProvider } from "../../Bancos/Bancos";
import { FilterContasProvider } from "./filter/contas/ContextFilterContas";
import { Statistcs } from "./Statistics";

const TableContainer = styled.div`
    padding:30px;
    opacity:0;
    width:100%;
    transform: translateY(50px);
    animation: fadeIn 0.5s ease forwards;
    min-width:fit-content;
`
    
const Table = styled.table`
    width:100%;
    border:var(--light-border);
    opacity: ${(props) => ((props.loadingPagination) ? 0.5 : 1)};
    pointer-events: ${(props) => ((props.loadingPagination) ? 'none' : '')};

`

const TableHeader = styled.tr`
    user-select:none;
    background-color: var(--skyler-blue);
    color:white;
`;

const TableMainContent = styled.div`
    height:200px;
    overflow:auto;
    width:fit-content;
`

const TableRow = styled.tr`
    background-color:white;
`

const TableHeaderValue = styled.th`
        padding:10px;
        font-size:13px;
        font-weight:500;
`
const TableRowValue = styled.td`
        border-bottom:2px solid #f7f3f3;
        padding:10px;
        font-size:13px;
        text-align:center;
        &:hover{
            background-color:#f7f3f3;
        }
`
const Money = styled.div`
   color:rgb(36, 205, 56);
   font-weight:400;
`

export const FeatureTable = ({author}:{author:string})=>{

    return(
        <PaginationProvider>
            <FilteredDataNotContasProvider>
                <FilterContasProvider>
                    <TableFilterProvider>
                        <CleanAllFilterProvider>
                                {author==="contas" && <Statistcs/>}
                                <FeatureTableUI author={author}/>
                        </CleanAllFilterProvider>
                    </TableFilterProvider>
                </FilterContasProvider>
            </FilteredDataNotContasProvider>
        </PaginationProvider>
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
    const contas_data_n_pages = useContas().n_pages;
    const contas_refetch = useContas().refetch;

    const [loadingPagination, setLoadingPagination] = useState(false);


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
    const FilteredDataNotContas = useFilteredData().FilteredDataNotContas;
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
    },[dataFilter]);


    console.log('FILTERED DATA');
    console.log(FilteredDataNotContas);


    const [resolverOpenStates, setResolverOpenStates] = useState(
        data?.map(() => false)
      );

    useEffect(()=>{
        setResolverOpenStates(data?.map(() => false))
    },[data])
    return(
        <TableContainer className="table_container">
            <TableBar setLoadingPagination = {setLoadingPagination} loadingPagination={loadingPagination} filteredKey={filteredKey} setFilteredKey={setFilteredKey} author={author}/>
            <Table loadingPagination={loadingPagination}>
                <TableHeader>
                    {columns?.filter(e=>e!=="id_grupo")?.map((e)=>{
                        return(
                            <>
                                <TableHeaderValue className="table_header_value" key={e}>
                                    <div className="flex items-center justify-center gap-[5px]">
                                        <div>
                                            {getUIColumnName(author,e)} 
                                        </div>
                                        {author!=="contas" && <FilterDialog data={data} column={e}/>}
                                    </div>
                                </TableHeaderValue>                   
                            </>
                        )
                    })}
                    <TableHeaderValue>Gerenciar</TableHeaderValue>                   
                </TableHeader>
                {/* <TableMainContent> */}
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
                    }).map((row,i)=>{
                        console.log('ROW');
                        console.log(row);
                        console.log("VALOR NECESSARIO");
                        console.log(row['valor'])
                        return(
                            <TableRow id={row[identifier]} key={row[identifier]}>
                                {columns?.filter(e=>e!=="id_grupo").map((column)=>{
                                    return(
                                        <>
                                            <TableRowValue key={row[identifier]}>
                                                {
                                                    (column!=='situacao')?(
                                                        
                                                    isStringDate(row[column])?
                                                    TZtoFriendlyDate(row[column]):((column.includes("valor") || column.includes("saldo"))?<Money>{(BRLReais(row[column]))}</Money>
                                                    
                                                    :(column==="nome_grupo"?(row[column] + ` (cód: ${row['id_grupo']})`):row[column])))
                                                    
                                                    :(
                                                        ( //SITUACAO E UMA COLUNA DA TABELA CONTAS
                                                            <Resolver row={row} key={row[identifier]} resolverOpen={resolverOpenStates && resolverOpenStates[i]}
                                                            setResolverOpen={(open) => {
                                                                setResolverOpenStates((prevStates) => {
                                                                  prevStates[i] = open;
                                                                  return [...prevStates];
                                                                });
                                                              }}/>
                                                        )
                                                    )
                                                }
                                            </TableRowValue>
                                        </>
                                    )
                                })}
                                    <TableRowValue>
                                        <div className="flex gap-2 items-center justify-center">
                                            <CriarEditar edit={true} author={author} identifier_value={row[identifier]}/>
        
                                            <Deletar author={author} identifier_value={row[identifier]}/>
                                        </div>
                                    </TableRowValue>                   
                            </TableRow>
                        )
                    })}
                {/* </TableMainContent> */}
            </Table>
            {author === "contas" && <PaginationFeatureTable loadingPagination={loadingPagination} setLoadingPagination={setLoadingPagination} n_pages={contas_data_n_pages} refetch={contas_refetch}/>}
        </TableContainer>
    )
    
}


