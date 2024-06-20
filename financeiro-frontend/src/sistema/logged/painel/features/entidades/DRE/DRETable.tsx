import styled from 'styled-components';
import { useDRE } from './DREContext';
import { BRLReais } from '@/sistema/essentials';

const TableContainer = styled.div` 
    opacity:0;
    margin-top:30px;
    width:100%;
    transform: translateY(50px);
    animation: fadeIn 0.5s ease forwards;
    min-width:fit-content;
`
    
const Table = styled.table`
    width:100%;
    border:var(--light-border);
    opacity:${(props)=>props.loading?"0.5":"1"};
    pointer-events:${(props)=>props.loading?"none":""};
`

const TablePreHeader = styled.tr`
    user-select:none;
    background-color: #f4f2f2;
    color:var(--skyler-blue);
`;

const TableHeader = styled.tr`
    user-select:none;
    background-color:#fffbfb;
    color:var(--skyler-blue);
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
        border:var(--light-border);

`
const TablePreHeaderValue = styled.th`
        padding:10px;
        font-size:13px;
        font-weight:500;
`

const TableRowValue = styled.td`
        color:${(props)=>props.pagar_receber==="pagar"?"red":"green"};
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

const CategoriaName = styled.td`
    border:var(--light-border);
    user-select:none;
    background-color:#fffbfb;
    color:var(--skyler-blue);
    text-align:center;
`

export const DRETable = ({loading,setLoading}:{loading:boolean,setLoading:any})=>{
    const n_lojas = 7;
    const DREData = useDRE().DREData;
    console.log(DREData);
    const unique_categories = [... new Set(DREData?.map((e)=>{return e.categoria_fiscal}))]
    const unique_lojas = [... new Set(DREData?.map((e)=>{return e.nome_loja}))]
    console.log(unique_categories);
    const successFilter = useDRE().successFilter;
    console.log(successFilter)

    return(
        <TableContainer>
            <Table loading={loading}>
                <TablePreHeader>
                    <TablePreHeaderValue rowSpan={2}>Categoria</TablePreHeaderValue>
                    <TablePreHeaderValue colSpan={n_lojas-1}>Loja</TablePreHeaderValue>
                </TablePreHeader>
                <TableHeader>
                    {unique_lojas?.map((e)=>{
                        return(
                            <TableHeaderValue>{e}</TableHeaderValue>
                        )
                    })}
                </TableHeader>
                {unique_categories?.map((categoria)=>{
                    return(
                        <TableRow>
                            <CategoriaName>{categoria}</CategoriaName>
                            {unique_lojas?.map((loja)=>{
                                return(
                                    <TableRowValue pagar_receber={DREData?.filter((e)=>e.nome_loja===loja && e.categoria_fiscal===categoria)[0]?.pagar_receber}>
                                        {BRLReais(DREData?.filter((e)=>e.nome_loja===loja && e.categoria_fiscal===categoria)[0]?.RESULTADO)}
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

//11 linhas 6 colunas, onde 1 linha é LOJA, e coluna departamento