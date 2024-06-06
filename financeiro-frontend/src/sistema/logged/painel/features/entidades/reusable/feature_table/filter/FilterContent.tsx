import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTableFilter } from "./FilterContext";

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

const ItemValue = styled.div`
    font-size: 14px;
    font-weight: 300;
    color: gray;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterContent = ({data,column}:{data:{[key:string | number]:any}[],column:string}) => {

    const setFilter = useTableFilter().setFilteredData;//global (nao so nessa coluna)


    const list = data.map((row)=>{
        return row[column];
    });

    const [checkedValues, setCheckedValues] = useState([]);


    const manageCheck = (value) => {
        if (checkedValues.includes(value)) {
            setCheckedValues(checkedValues.filter((element) => element !== value));

        } else {
            setCheckedValues([...checkedValues, value]);
        }
    };

    useEffect(()=>{
        setFilter((prev)=>{
            return{
                ...prev,
                [column]:checkedValues
            }
        })
    },[checkedValues])

    useEffect(()=>{
        console.log(checkedValues)
    },[checkedValues])


    return (
        <FilterContentContainer>
            {list.map((element) => (
                <ItemContainer key={element}>
                    <ItemCheckBoxInput
                        checked={checkedValues.includes(element)}
                        onChange={() => manageCheck(element)}
                        type="checkbox"
                    />
                    <ItemValue>{element}</ItemValue>
                </ItemContainer>
            ))}
        </FilterContentContainer>
    );
};
