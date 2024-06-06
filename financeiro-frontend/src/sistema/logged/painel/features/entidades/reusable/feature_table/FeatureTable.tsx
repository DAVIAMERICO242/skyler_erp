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
import { useTableFilter } from "./filter/FilterContext";
import { TableFilterProvider } from "./filter/FilterContext";
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
        <TableFilterProvider>
            <FeatureTableUI author={author}/>
        </TableFilterProvider>
    )
    
}

const FeatureTableUI = ({author}:{author:string})=>{
    const [filteredKey,setFilteredKey] = useState("");
    switch (author){
        case "terceiros":
          var {data} = useTerceiros();
          var {refetch} = useTerceiros();
          var excel_name = "terceiros_cadastrados.xlsx"
          var identifier = "nome";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "lojas":
          var {data} = useLojas();
          var {refetch} = useLojas();
          var excel_name = "lojas_cadastradas.xlsx"
          var identifier = "nome";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "bancos":
          var {data} = useBancos();
          var {refetch} = useBancos();
          var excel_name = "bancos_cadastrados.xlsx";
          var identifier = "conta";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        case "contas":
          var {data} = useContas();
          var {refetch} = useContas();
          var excel_name = "historico_pagar_receber.xlsx";
          var identifier = "id";
          var columns = Object.keys((data?.length)?data[0]:{})
          break;
        default:
          var {data} = [];
          var identifier = "";
          var columns:string[] = [];
      }

    const filteredData = useTableFilter().filteredData;
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
                    if(filteredData){
                        for (let column of Object.keys(data_row)){
                            if(!filteredData[column]?.length){
                                continue;
                            }else{
                                if(!filteredData[column].includes(data_row[column])){
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


