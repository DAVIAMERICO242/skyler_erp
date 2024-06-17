
import styled from "styled-components"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCharts } from "../chartsContext";
import { useEffect, useState } from "react";
const VencidasApagarContainer = styled.div`
    color:white;
    height:300px;
    border-radius:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    color:black;
    background-color:rgb(225, 249, 72);
    transition:all 0.2s ease;
    box-shadow: rgba(223, 241, 28, 0.25) 0px 50px 100px -20px, rgba(211, 205, 26, 0.3) 0px 30px 60px -30px;
    &:hover{
        cursor:pointer;
        transform: scale(1.2); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
    >h1{
        font-size:40px;
    }
    >h2{
        font-size:20px;
    }
    >div{
        font-size:14px;
    }
`

export const VencidasApagar = ()=>{
    
    const fetchRequiredChart = useCharts().fetchRequiredChart;

    useEffect(()=>{
        fetchRequiredChart('pagar_vencidas');
    },[]);

    const [pagarVencidas, setPagarVencidas] = useState<{
                                                vencimento?: string;
                                                terceiro?: string;
                                                valor?: number;
                                                valor_resolucao?: number;
                                            }[] | undefined>(undefined);

    const chartData = useCharts()?.chartData;

    useEffect(()=>{
        console.log(chartData);
        if(chartData && chartData['pagar_vencidas']){
            setPagarVencidas(chartData['pagar_vencidas']);
        }
    },[chartData]);

    return(
        <Dialog>
            <DialogTrigger className="w-full">
                <VencidasApagarContainer>
                    <h2>Vencidas a pagar (não resolvidas + parcial restante)</h2>
                    <h1>R$ 6559.6</h1>
                </VencidasApagarContainer>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Vencidas a pagar</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
                <div>{chartData && JSON.stringify(chartData['pagar_vencidas'])}</div>
            </DialogContent>
        </Dialog>
    )
}