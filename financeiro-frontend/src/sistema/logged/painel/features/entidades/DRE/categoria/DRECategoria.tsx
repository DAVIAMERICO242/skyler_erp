import styled from "styled-components"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState } from "react";
import { DetailsTable } from "./DetailsTable";

const CategoriaName = styled.td`
    border:var(--light-border);
    user-select:none;
    background-color:#fffbfb;
    color:var(--skyler-blue);
    text-align:center;
    cursor: pointer;
    &:hover{
        text-decoration: underline;
    }
`

export const DRECategoria = ({categoria})=>{
    const [open,setOpen] = useState(false);

    return(
        <>
            <CategoriaName onClick={()=>{setOpen(true)}}>{categoria}</CategoriaName>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Detalhe DRE</DialogTitle>
                    <DetailsTable categoria={categoria}/>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}