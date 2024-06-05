import styled from "styled-components"
import favicon from '/SK_REMOS.png'
import { LoadingButton } from "@/components/ui/LoadingButton"
import not_found_feature from '/not_found_feature.png'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { TerceirosForm } from "../Terceiros/TerceirosForm";
import { useState } from "react";
import { BancosForm } from "../Bancos/BancosForm";
import { ContasForm } from "../Contas/ContasForm";
import { LojasForm } from "../Lojas/LojasForm";

const StyledNotFound = styled.div`
    opacity:0;
    transform: translateY(50px);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    height:70vh;
    margin-right:10%;
    animation: fadeIn 0.5s ease forwards;
    >img{
        width:220px;
        height:200px;
        margin-bottom: 50px;
    }
    >.not_found{
        font-size:50px;
        font-weight:300;
        margin-bottom: 50px;
    }
`

export const NotFoundFeature = ({author}:{author:string})=>{
    const [open,setOpen] = useState<boolean>(false);

    return(
        <StyledNotFound>
            <img src={not_found_feature}/>
            <div className="not_found">Nenhum dado encontrado</div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <LoadingButton loading={false} type="skyler" className="w-1/5">
                            {`Cadastrar ${author}`}
                        </LoadingButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Cadastrar {author}</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                        </DialogHeader>
                            {author === "terceiros" ? <TerceirosForm edit={false}/> : null}
                            {author === "lojas" ? <LojasForm edit={false}/> : null}
                            {author === "bancos" ? <BancosForm edit={false}/> : null}
                            {author === "contas" ? <ContasForm edit={false}/> : null}
                    </DialogContent>
                </Dialog>
        </StyledNotFound>
    )
}