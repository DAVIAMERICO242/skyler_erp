import styled from "styled-components";
import { PagarHoje } from "./PagarHoje";
import { ReceberHoje } from "./ReceberHoje";
import { VencidasApagar } from "./VencidasApagar";
import { VencidasAreceber } from "./VencidasAreceber";

const ChartsContainer = styled.div`
    margin-top:50px;
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:50vh;
    @media (max-width: 1000px){
        display:block;
   } 
`

const ChartsFlex = styled.div`
   display:grid;
   grid-template-columns: 600px 600px;
   gap:10px;
   @media (max-width: 1300px){
    grid-template-columns: 500px 500px;
   }
   @media (max-width: 1100px){
    grid-template-columns: 450px 450px;
   } 
   @media (max-width: 1000px){
    grid-template-columns:auto;
   } 

`

const Chart = styled.div`
    user-select:none;
`

export const Charts = ()=>{
    return(
        <ChartsContainer>
            <ChartsFlex>
                <Chart>
                    <PagarHoje/>
                </Chart>
                <Chart>
                    <ReceberHoje/>
                </Chart>
                <Chart>
                    <VencidasApagar/>
                </Chart>
                <Chart>
                    <VencidasAreceber/>
                </Chart>
            </ChartsFlex>
        </ChartsContainer>
    )
    
}