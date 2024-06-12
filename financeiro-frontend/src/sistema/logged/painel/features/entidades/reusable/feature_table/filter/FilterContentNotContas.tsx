import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTableFilter } from "./FilterContextsNotContasExceptClean";
import { useCleanAllFilter } from "./FilterContextsNotContasExceptClean";
import { TZtoFriendlyDate, isStringDate} from "@/sistema/essentials";

const FilterContentContainer = styled.div`
    border: var(--light-border);
    border-radius: 2px;
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 150px;
    overflow-y: auto;
    padding: 5px 10px;
`;

const ItemContainer = styled.div`
    display: flex;
    gap: 15px;
`;

const ItemCheckBoxInput = styled.input`
    border-radius: 50%;
`;

const ItemUIValue = styled.div`
    font-size: 14px;
    font-weight: 300;
    color: gray;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterContent = ({data,column,searchedValue,isAllSelected,setIsAllSelected,limparSignal}:{data:{[key:string | number]:any}[], searchedValue:string, column:string,isAllSelected:boolean,setIsAllSelected:any,limparSignal:number}) => {

    const dataFilter = useTableFilter().dataFilter;
    const setFilter = useTableFilter().setdataFilter;//global (nao so nessa coluna)

    const cleanAllState = useCleanAllFilter().cleanAll
    const setCleanAll = useCleanAllFilter().setCleanAll


    const list = [...new Set(data.map((row)=>{ return row[column];}))];

    const [checkedValues, setCheckedValues] = useState([]);


    const manageCheck = (value) => {
        if (checkedValues.includes(value)) {
            setCheckedValues(checkedValues.filter((element) => element !== value));

        } else {
            setCheckedValues([...checkedValues, value]);
        }
    };

    useEffect(()=>{//embora seja executado apenas nesse componente com contexto de coluna, a logica permite limpar em todas colunas
        setCheckedValues([]);
    },[cleanAllState]);

    useEffect(()=>{//selecionar todos valores do filtro da coluna
        if(isAllSelected){
            setCheckedValues([...list])
        }
    },[isAllSelected])

    useEffect(()=>{//limpar filtro de coluna
        setCheckedValues([]);
        setIsAllSelected(false);
    },[limparSignal])

    useEffect(()=>{//configurar objeto abastrato que ajuda a gerenciar filtros
        setFilter((prev)=>{
            return{
                ...prev,
                [column]:checkedValues
            }
        })
    },[checkedValues])


    return (
        <FilterContentContainer>
            {list.filter((e)=>{
                if(!searchedValue){
                    return true;
                }
                if(typeof e==="string"){
                    return e.includes(searchedValue)
                }else{
                    return e===searchedValue;
                }
            }).map((element) => (
                <ItemContainer key={element}>
                    <ItemCheckBoxInput
                        checked={checkedValues.includes(element)}
                        onChange={() => manageCheck(element)}
                        type="checkbox"
                    />
                    <ItemUIValue>
                        {
                            isStringDate(element)?
                            TZtoFriendlyDate(element):element
                        }
                    </ItemUIValue>
                </ItemContainer>
            ))}
        </FilterContentContainer>
    );
};
