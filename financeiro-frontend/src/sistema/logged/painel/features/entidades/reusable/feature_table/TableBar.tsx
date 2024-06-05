import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";

const TableBarContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    width:60%;
    gap:10px;
    text-wrap: nowrap;
    font-weight:500;
    padding:20px 30px;
    border:var(--light-border);
    border-bottom:none;
    @media(max-width: 1200px) {
        /* Defina as propriedades de estilo específicas para telas menores aqui */

        flex-direction:column;
        align-items:flex-start;
        gap:10px;
    }
`

const FiltroContainer = styled.div`
    display:flex;
    align-items:center;
    gap:10px;
    text-wrap: nowrap;
    font-weight:500;
    @media(max-width: 1200px) {
        /* Defina as propriedades de estilo específicas para telas menores aqui */

        flex-direction:column;
        align-items:flex-start;
        gap:10px;
    }
`

export const TableBar = ({filteredKey,setFilteredKey}:{filter:string,setFilteredKey:any})=>{

    const manage_filter = (value:string)=>{
        setFilteredKey(value.trim());
    }

    return(
        <TableBarContainer>
            <FiltroContainer>
                Filtrar author:
                <Input className="h-[24px] w-[200px]" onChange={(e)=>{manage_filter(e.target.value)}}></Input>
            </FiltroContainer>
            <LoadingButton type="neutral">Exportar tudo</LoadingButton>
        </TableBarContainer>
    )
}