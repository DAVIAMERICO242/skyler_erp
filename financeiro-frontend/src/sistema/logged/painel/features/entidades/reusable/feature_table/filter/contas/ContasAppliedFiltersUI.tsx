import { TZtoFriendlyDate, areAllValuesUndefined, isStringDate } from "@/sistema/essentials";
import { useFilterContas } from "./ContextFilterContas";
import styled from "styled-components";
import { getUIColumnName } from "../../../../BackendHelper/formatBackendData/getUIColumnName";

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

    return (
        <ContainerContasAppliedFiltersUI>
            <div className="text-sm mb-1">Filtros selecionados</div>
            <FilterList>
                {filterContas && 
                    Object.keys(filterContas).map((e)=>{
                        if(filterContas[e]){
                            return(
                                <Filter>
                                    {getUIColumnName("contas",e)}: 
                                    {isStringDate(filterContas[e])?
                                     (" " + TZtoFriendlyDate(filterContas[e])):(" " + filterContas[e])
                                    }
                                </Filter>
                            )
                        }
                    })
                }
            </FilterList>
        </ContainerContasAppliedFiltersUI>
    )
}