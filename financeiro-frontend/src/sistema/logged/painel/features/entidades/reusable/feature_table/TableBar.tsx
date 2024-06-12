import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { CriarEditar } from "./CriarEditar";
import { Exportar } from "./Exportar";
import { FilterContas } from "./filter/contas/FilterContas";
import { CleanAll } from "./filter/CleanAllIncludeContas";

const TableBarContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    width:100%;
    gap:10px;
    text-wrap: nowrap;
    font-weight:500;
    padding:20px 30px;
    border:var(--light-border);
    border-bottom:none;
    opacity: ${(props) => ((props.loadingPagination) ? 0.5 : 1)};
    pointer-events: ${(props) => ((props.loadingPagination) ? 'none' : '')};
    >.gerenciar{
        display:flex;
        gap:10px;
    }
    @media(max-width: 1200px) {
        /* Defina as propriedades de estilo específicas para telas menores aqui */

        flex-direction:column;
        align-items:flex-start;
        gap:20px;
    }
`

export const TableBar = ({author,loadingPagination,setLoadingPagination}:{author:string,loadingPagination:any,setLoadingPagination:any})=>{
    return(
        <TableBarContainer loadingPagination={loadingPagination} className="table_bar_container">
            <CleanAll/>
            {author==="contas" && <FilterContas setLoadingPagination={setLoadingPagination}/>}
            <div className="gerenciar">
                <CriarEditar edit={false} author={author}/>
                <Exportar author={author}/>
            </div>
        </TableBarContainer>
    )
}