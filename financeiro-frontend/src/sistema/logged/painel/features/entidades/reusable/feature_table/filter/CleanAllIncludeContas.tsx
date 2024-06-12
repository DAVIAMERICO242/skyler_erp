/* eslint-disable no-var */
import styled from "styled-components";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { useCleanAllFilter, useTableFilter } from "./FilterContextsNotContasExceptClean";
import { areAllValuesEmptyArrays, areAllValuesUndefined } from "@/sistema/essentials";
import { useFilterContas } from "./contas/ContextFilterContas";

const CleanAllContainer = styled.div`
      display:flex;
      width:200px;
      align-items:center;
      user-select:none;
      justify-content:center;
      gap:20px;
      border-radius:50px;
      background-color:#f6f3f2 ;
      border:var(--light-border);
      font-weight:400;
      padding:5px 10px;
      color:var(--skyler-blue);
      opacity: ${props=>props.check_is_filtered?1:0.5};
      pointer-events: ${props=>props.check_is_filtered?"":"none"};
      cursor:pointer;
`

export const CleanAll = ()=>{
    
    var {dataFilter} = useTableFilter();

    const filterContas = useFilterContas().filterContas;

    var check_is_filtered= (!areAllValuesEmptyArrays(dataFilter) || (filterContas && !areAllValuesUndefined(filterContas)));


    const cleanAllState = useCleanAllFilter().cleanAll
    const setCleanAll = useCleanAllFilter().setCleanAll

    return(
        <CleanAllContainer check_is_filtered={check_is_filtered} onClick={()=>{setCleanAll(prev=>-1*prev)}}>
            Limpar filtros
            <FaFilterCircleXmark style={{fontSize:"20px"}}/>
        </CleanAllContainer>
    )
}