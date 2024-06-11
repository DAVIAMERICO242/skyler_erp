import { BsFilter } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { FilterContent } from "./FilterContent";

const FilterDialogContainer = styled.div`
  position: relative;
`;

const FilterUI = styled.div`
  display: ${props => props.open ? 'flex' : 'none'};
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 20px;
  border-radius: 3px;
  background-color: white;
  user-select: none;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.5s ease;
  animation: fadeIn 0.1s ease forwards;
  position: absolute;
  left: 70%;
  top: 70%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const FilterTitle = styled.div`
  font-size: 12px;
  color: black;
  text-wrap: nowrap;
  margin-bottom: 10px;
  font-weight: 400;
  color: gray;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterDialog = ({data,column}:{data:{[key:string | number]:any}[],column:string}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const [searchedValue,setSearchedValue] = useState("");

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [limparSignal, setLimparSignal] = useState(-1);

  const manageOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (//USADO APENAS PARA FILTROS SEM SER CONTA
    <FilterDialogContainer className="filter_dialog_container" ref={containerRef}>
      <BsFilter onClick={manageOpen} className="filter_icon text-[20px] cursor-pointer" />
      
      <FilterUI className="filter_UI" open={open}>
        <FilterTitle>Filtro</FilterTitle>
        <div style={{display:"flex",gap:"10px", marginBottom:"10px"}}>
          <a href="#" onClick={()=>{setIsAllSelected(true)}}  style={{color:"var(--skyler-blue)", fontSize:"10px", textDecoration:"underline"}}>Selecionar tudo</a>
          <a href="#" onClick={()=>{setLimparSignal((prev)=>-1*prev)}} style={{color:"red", fontSize:"10px", textDecoration:"underline"}}>Limpar</a>
        </div>
        <Input onChange={(e)=>{setSearchedValue(e?.target?.value?.trim())}} className="h-[10px] w-[180px] text-xs p-3 mb-[10px] text-black" placeholder="Buscar..." />
        <FilterContent
            limparSignal={limparSignal}
            isAllSelected={isAllSelected}
            setIsAllSelected={setIsAllSelected}
            data={data}
            column={column}
            searchedValue={searchedValue}
         />
      </FilterUI>
      
    </FilterDialogContainer>
  );
};
