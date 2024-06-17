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
import { useCharts } from "../chartsContext"
import { useEffect, useState } from "react"

const PagarHojeContainer = styled.div`
    color:white;
    border-radius:5px;
    height:300px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:rgb(239, 85, 85);
    box-shadow: rgba(235, 64, 38, 0.25) 0px 50px 100px -20px, rgba(227, 56, 26, 0.3) 0px 30px 60px -30px;
    transition:all 0.2s ease;
    &:hover{
        cursor:pointer;
        transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
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

export const PagarHoje = ()=>{

    const fetchRequiredChart = useCharts().fetchRequiredChart;

    useEffect(()=>{
        fetchRequiredChart("a_pagar_hoje");
    },[]);

    const [pagarHoje, setPagarHoje] = useState<{
                                                vencimento?: string;
                                                terceiro?: string;
                                                valor?: number;
                                                valor_resolucao?: number;
                                            }[] | undefined>(undefined);

    const chartData = useCharts()?.chartData;

    useEffect(()=>{
        console.log(chartData);
        if(chartData && chartData['a_pagar_hoje']){
            setPagarHoje(chartData['a_pagar_hoje']);
        }
    },[chartData]);

    return(
        <Dialog>
            <DialogTrigger className="w-full">
                <PagarHojeContainer>
                    <h2>A pagar hoje</h2>
                    <h1>R$ 6559.6</h1>
                </PagarHojeContainer>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>A pagar hoje</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                </DialogHeader>
                <div>{chartData && JSON.stringify(chartData['a_pagar_hoje'])}</div>
            </DialogContent>
        </Dialog>
    )
}
