import { TZtoFriendlyDate, areAllValuesUndefined, isStringDate } from "@/sistema/essentials";
import { useFilterContas } from "./ContextFilterContas";
import styled from "styled-components";
import { getUIColumnName } from "../../../../BackendHelper/formatBackendData/getUIColumnName";
import { TiDeleteOutline } from "react-icons/ti";
import { UseGrupoContas } from "../../../../Contas/local-contexts/grupo_contas-context";

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
    const grupoContasData = UseGrupoContas().data;
    var check_is_filtered= ((filterContas && !areAllValuesUndefined(filterContas)));

    const manager_particular_clean = (key)=>{
        setFilterContas({
            ...filterContas,
            [key]:undefined
        })
    }

    if(check_is_filtered){//e = coluna
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
                                            })):(e==="id_grupo"?
                                                (grupoContasData?.filter((e1)=>{
                                                    return e1.id_grupo===parseInt(filterContas[e]);
                                                })?.map((e2)=>{
                                                    return e2.nome_grupo + ` (cód: ${e2.id_grupo})`;
                                                }
                                                
                                                )[0]                                                        
                                                )
                                                :filterContas[e] 
                                            ))
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