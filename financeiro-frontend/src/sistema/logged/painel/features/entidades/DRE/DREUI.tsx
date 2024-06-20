import { DREFilter } from "./DREFilter"
import { DRETable } from "./DRETable"
import styled from "styled-components"

const DREUIContainer = styled.div`
    padding:5%;
`

const DREAvisos = styled.div`
    color:#043b6f;
    display:flex;
    background-color:#a8d5f5;
    border: 1px solid #84a4c1;
    font-size:15px;
    padding:10px 15px;
    border-radius:5px;
    flex-direction:column;
    gap:10px;
`

const DREAviso = styled.div`
     display:flex;
     align-items:center;
     gap:10px;
`

export const DREUI = ()=>{
    return(
        <DREUIContainer>
            <DREAvisos>
               <DREAviso>
                    <b>Pagamento (padrão):</b>A DRE é baseada nas lojas que realmente receberam/efetuaram o pagamento seja parcial ou completamente resolvido.
               </DREAviso> 
               <DREAviso>
                    <b>Competência:</b>A DRE é baseada nas lojas de origem na data de competência.
               </DREAviso> 
               <DREAviso>
                    <b>Vencimento:</b>A DRE é baseada nas lojas de origem na data de vencimento.
               </DREAviso> 
            </DREAvisos>
            <DREFilter/>
            <DRETable/>
        </DREUIContainer>
    )
}