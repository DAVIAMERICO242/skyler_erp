import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { CriarEditar } from "./CriarEditar";
import { Exportar } from "./Exportar";
import { CleanAll } from "./filter/CleanAll";

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


export const TableBar = ({author}:{author:string})=>{


    return(
        <TableBarContainer className="table_bar_container">
            <CleanAll/>
            <div className="gerenciar">
                <CriarEditar edit={false} author={author}/>
                <Exportar author={author}/>
            </div>
        </TableBarContainer>
    )
}