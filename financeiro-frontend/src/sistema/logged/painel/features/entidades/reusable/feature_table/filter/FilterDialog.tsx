import { BsFilter } from "react-icons/bs";
import { useState } from "react";
import styled from "styled-components";
import { FaFilter } from "react-icons/fa";

const FilterDialogContainer = styled.div`
   position:relative;
`
const FilterUI = styled.div`
    border-radius:3px;
    background-color:white;
    color:var(--skyler-blue);
    user-select:none;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.5s ease;
    animation: fadeIn 0.1s ease forwards;
    position:absolute;
    left:100%;
    top:100%;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
`

export const FilterDialog = ()=>{
    const [open, setOpen] = useState(false);

    const manage_open = ()=>{
        setOpen((prev)=>!prev);
    }

    return(
        <FilterDialogContainer className="filter_dialog_container">
            <BsFilter onClick={manage_open} className="filter_icon text-2xl"/>
            {open && <FilterUI className="filter_UI">
                        aaaaaa
                    </FilterUI>}
        </FilterDialogContainer>
    )
}