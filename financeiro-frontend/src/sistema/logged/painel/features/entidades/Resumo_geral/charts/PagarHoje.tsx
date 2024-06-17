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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { BRLReais, SubtractColumns, TZtoFriendlyDate } from "@/sistema/essentials"
import { Exportar } from "./Exportar"

const PagarHojeContainer = styled.div`
    animation: fadeInYFromTop 0.5s ease;
    transition:all 0.2s ease;
    color:white;
    border-radius:5px;
    height:300px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:rgb(239, 85, 85);
    box-shadow: rgba(235, 64, 38, 0.25) 0px 50px 100px -20px, rgba(227, 56, 26, 0.3) 0px 30px 60px -30px;
    &:hover{
        z-index:9999;
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
const TableLimiter = styled.div`
    max-height:400px;
    overflow-y:auto;
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
                    <h1>{chartData && BRLReais(SubtractColumns(chartData['a_pagar_hoje'],'valor','valor_resolucao'))}</h1>
                </PagarHojeContainer>
            </DialogTrigger>
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                <DialogTitle>A pagar hoje</DialogTitle>
                <DialogDescription>
                    Veja com mais detalhes em contas a pagar / receber
                </DialogDescription>
                </DialogHeader>
                <div className="flex w-full items-end justify-end">
                    <Exportar author="a_pagar_hoje"/>
                </div>
                <TableLimiter>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead className="w-[100px]">Vencimento</TableHead>
                            <TableHead className="w-[100px]">Terceiro</TableHead>
                            <TableHead className="w-[100px]">Valor necessário</TableHead>
                            <TableHead className="w-[100px]">Valor pago</TableHead>
                            <TableHead className="w-[100px]">Restante</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chartData && chartData['a_pagar_hoje']?.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.id}</TableCell>
                                <TableCell>{TZtoFriendlyDate(e.vencimento)}</TableCell>
                                <TableCell>{e.terceiro}</TableCell>
                                <TableCell>{BRLReais(e.valor)}</TableCell>
                                <TableCell >{BRLReais(e.valor_resolucao)}</TableCell>
                                <TableCell >{BRLReais(e.valor - e.valor_resolucao)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
               </TableLimiter>
            </DialogContent>
        </Dialog>
    )
}
