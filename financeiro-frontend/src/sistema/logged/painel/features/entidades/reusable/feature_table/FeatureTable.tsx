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

const TableContainer = styled.div`
    padding:30px;
    opacity:0;
    transform: translateY(50px);
    animation: fadeIn 0.5s ease forwards;
    min-width:fit-content

`

const Table = styled.table`
    width:100%;
    border:var(--light-border);
`

const TableHeader = styled.tr`
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
    useEffect(()=>{
        console.log(filteredKey);
    },[filteredKey])

    console.log('DATA NA TABELA');

    console.log('IDENTIFIER');

    console.log(identifier)

    return(
        <TableContainer className="table_container">
            <TableBar filteredKey={filteredKey} setFilteredKey={setFilteredKey} author={author}/>
            <Table>
                <TableHeader>
                    {columns?.map((e)=>{
                        return(
                            <>
                                <TableHeaderValue key={e}>{e}</TableHeaderValue>                   
                            </>
                        )
                    })}
                    <TableHeaderValue>Gerenciar</TableHeaderValue>                   
                </TableHeader>
                {data?.filter((data_row)=>{
                    if(filteredKey){

                        console.log(identifier)

                        if(typeof data_row[identifier]==="string"){
                            return data_row[identifier].includes(filteredKey);
                        }else{
                            return data_row[identifier].toString().includes(filteredKey);
                        }

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