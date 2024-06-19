import styled from 'styled-components';

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

`

const TableHeader = styled.tr`
    user-select:none;
    background-color: #f4f2f2;
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

export const DRETable = ()=>{
    return(
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableHeaderValue>Categoria fiscal</TableHeaderValue>
                    <TableHeaderValue>Loja1</TableHeaderValue>
                    <TableHeaderValue>Loja2</TableHeaderValue>
                    <TableHeaderValue>Loja3</TableHeaderValue>
                    <TableHeaderValue>Loja4</TableHeaderValue>
                    <TableHeaderValue>Loja5</TableHeaderValue>
                    <TableHeaderValue>Loja6</TableHeaderValue>
                    <TableHeaderValue>Loja7</TableHeaderValue>
                </TableHeader>
                <TableRow>
                    <TableRowValue>Categoria</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                </TableRow>
                <TableRow>
                    <TableRowValue>Categoria</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                </TableRow>
                <TableRow>
                    <TableRowValue>Categoria</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                    <TableRowValue>R$ 100,00</TableRowValue>
                </TableRow>
            </Table>
        </TableContainer>
    )
}

//11 linhas 6 colunas, onde 1 linha é LOJA, e coluna departamento