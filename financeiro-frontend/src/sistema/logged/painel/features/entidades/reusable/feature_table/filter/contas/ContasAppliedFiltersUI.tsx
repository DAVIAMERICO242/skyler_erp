import { TZtoFriendlyDate, areAllValuesUndefined, isStringDate } from "@/sistema/essentials";
import { useFilterContas } from "./ContextFilterContas";
import styled from "styled-components";
import { getUIColumnName } from "../../../../BackendHelper/formatBackendData/getUIColumnName";
import { TiDeleteOutline } from "react-icons/ti";

/* eslint-disable no-var */

const ContainerContasAppliedFiltersUI = styled.div`
    width:250px;
    background-color:#fefdfd;
    border: var(--light-border);
    border-radius:5px;
    padding:8px 5px;
`

const FilterList = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:3px;
`
const Filter = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    gap:2px;
    user-select:none;
    font-size:12px;
    padding:1px 3px;
    border-radius:50px;
    background-color:#f7f1f1;
    border: var(--light-border);
`

export const ContasAppliedFiltersUI = ()=>{

    const filterContas =  useFilterContas().filterContas;
    const setFilterContas = useFilterContas().setFilterContas;

    var check_is_filtered= ((filterContas && !areAllValuesUndefined(filterContas)));

    const manager_particular_clean = (key)=>{
        setFilterContas({
            ...filterContas,
            [key]:undefined
        })
    }

    if(check_is_filtered){
        return (
            <ContainerContasAppliedFiltersUI>
                <div className="text-sm mb-1">Filtros selecionados</div>
                <FilterList>
                    {filterContas && 
                        Object.keys(filterContas).map((e)=>{
                            if(filterContas[e] || filterContas[e]===null){
                                return(
                                    <Filter>
                                        {getUIColumnName("contas",e)}: 
                                        {isStringDate(filterContas[e])?
                                         (" " + TZtoFriendlyDate(filterContas[e])):(" " + 
                                            ((e==="situacao")?(filterContas[e]?.map((element)=>{
                                                if(element===null){
                                                    return "não resolvido";
                                                }else{
                                                    return element;
                                                }
                                            })):filterContas[e])
                                            )
                                        }
                                        <TiDeleteOutline onClick={()=>manager_particular_clean(e)} className="text-xl cursor-pointer text-red-600"/>
                                    </Filter>
                                )
                            }
                        })
                    }
                </FilterList>
            </ContainerContasAppliedFiltersUI>
        )
    }else{
        return null;
    }
}