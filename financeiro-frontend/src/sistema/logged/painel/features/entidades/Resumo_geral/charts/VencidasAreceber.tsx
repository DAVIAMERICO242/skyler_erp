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

const VencidasAreceberContainer = styled.div`
    color:white;
    height:300px;
    border-radius:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    color:black;
    background-color:rgb(72, 234, 249);
    transition:all 0.2s ease;
    box-shadow: rgba(28, 149, 241, 0.25) 0px 50px 100px -20px, rgba(12, 85, 175, 0.3) 0px 30px 60px -30px;
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

export const VencidasAreceber = ()=>{
    
    const fetchRequiredChart = useCharts().fetchRequiredChart;

    useEffect(()=>{
        fetchRequiredChart('receber_vencidas');
    },[]);

    const [receberVencidas, setReceberVencidas] = useState<{
                                                vencimento?: string;
                                                terceiro?: string;
                                                valor?: number;
                                                valor_resolucao?: number;
                                            }[] | undefined>(undefined);

    const chartData = useCharts()?.chartData;

    useEffect(()=>{
        console.log(chartData);
        if(chartData && chartData['receber_vencidas']){
            setReceberVencidas(chartData['receber_vencidas']);
        }
    },[chartData]);
    
    return(
        <Dialog>
            <DialogTrigger className="w-full">
                <VencidasAreceberContainer>
                    <h2>Vencidas a receber (não resolvidas + parcial restante)</h2>
                    <h1>R$ 6559.6</h1>
                </VencidasAreceberContainer>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Vencidas a receber</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
                <div>{chartData && JSON.stringify(chartData['receber_vencidas'])}</div>
            </DialogContent>
        </Dialog>
    )
}