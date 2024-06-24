import { BRLReais } from "@/sistema/essentials";
import { useDRE } from "../DREContext";
import { Table,TableContainer, TableHeader, TableHeaderValue, TablePreHeader, TablePreHeaderValue, TableRow, TableRowValue } from "../DRETable"
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getDRECategoryDetails } from "../../BackendHelper/API/fetch";

const SubCategoriaName = styled.td`
    border:var(--light-border);
    user-select:none;
    background-color:#fffbfb;
    color:var(--skyler-blue);
    text-align:center;
    cursor: pointer;
    &:hover{
        text-decoration: underline;
    }
`

export const DetailsTable = ({categoria})=>{
    const [loading,setLoading] = useState(false);

    const DREFilter = useDRE().DREFilter;
    const [DRECategoryDetail,setDRECategoryDetail] = useState(undefined)

    console.log(DRECategoryDetail);
    const unique_tipos = [... new Set(DRECategoryDetail?.map((e)=>{return e.tipo_fiscal}))]
    const unique_lojas = [... new Set(DRECategoryDetail?.map((e)=>{return e.nome_loja}))]
    const n_lojas = unique_lojas?.length || 1;
    console.log(unique_tipos);
    const successFilter = useDRE().successFilter;
    console.log(successFilter)

    useEffect(()=>{
        setLoading(true);
        getDRECategoryDetails({filter:DREFilter,category:categoria}).then((d)=>d.json())
        .then((d)=>{
            console.log(d);
            setLoading(false);
            setDRECategoryDetail(d.data)
        }).catch(()=>setLoading(false))
    },[DREFilter])


    return(
        <TableContainer>
            <Table loading={loading}>
                <TablePreHeader>
                    <TablePreHeaderValue rowSpan={2}>Sub-categoria</TablePreHeaderValue>
                    <TablePreHeaderValue colSpan={n_lojas}>Loja</TablePreHeaderValue>
                </TablePreHeader>
                <TableHeader>
                    {unique_lojas?.map((e)=>{
                        return(
                            <TableHeaderValue>{e}</TableHeaderValue>
                        )
                    })}
                </TableHeader>
                {unique_tipos?.map((sub_categoria)=>{
                    return(
                        <TableRow>

                            <SubCategoriaName>{sub_categoria}</SubCategoriaName>
                            
                            {unique_lojas?.map((loja)=>{
                                return(
                                    <TableRowValue pagar_receber={DRECategoryDetail?.filter((e)=>e.nome_loja===loja && e.tipo_fiscal===sub_categoria)[0]?.pagar_receber}>
                                        {BRLReais(DRECategoryDetail?.filter((e)=>e.nome_loja===loja && e.tipo_fiscal===sub_categoria)[0]?.RESULTADO)}
                                    </TableRowValue>  
                                )
                            })}
                        </TableRow>
                    )
                })}
            </Table>
        </TableContainer>
    )
}