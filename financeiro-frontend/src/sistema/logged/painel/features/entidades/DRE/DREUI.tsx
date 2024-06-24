import { useState } from "react"
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
    const [loading,setLoading] = useState(false);//carregando filtro

    return(
        <DREUIContainer>
            <DREAvisos>
               <DREAviso>
                    <b>Pagamento previsto (padrão):</b>A DRE é baseada na DATA DE PREVISÃO e os valores são os valores integrais das contas, independente se foi resolvido ou não.
               </DREAviso> 
               <DREAviso>
                    <b>Pagamento real:</b>A DRE é baseada na DATA REAL DE TRANSAÇÃO, ela se baseia exatamente no valor real pago das contas, seja parcial ou resolvido.
               </DREAviso> 
               <DREAviso>
                    <b>Competência:</b>A DRE é baseada nas lojas de origem na data de competência, com base no valor bruto da conta .
               </DREAviso> 
            </DREAvisos>
            <DREFilter loading={loading} setLoading={setLoading}/>
            <DRETable loading={loading} setLoading={setLoading}/>
        </DREUIContainer>
    )
}