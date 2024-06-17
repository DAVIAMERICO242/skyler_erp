
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { BRLReais, SubtractColumns, TZtoFriendlyDate } from "@/sistema/essentials";
import { Exportar } from "./Exportar";

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

const TableLimiter = styled.div`
    max-height:400px;
    overflow-y:auto;
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
                    <h2>Vencidas a pagar</h2>
                    <h1>{chartData && BRLReais(SubtractColumns(chartData['pagar_vencidas'],'valor','valor_resolucao'))}</h1>
                </VencidasApagarContainer>
            </DialogTrigger>
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                <DialogTitle>Vencidas a pagar</DialogTitle>
                <DialogDescription>
                Veja com mais detalhes em contas a pagar / receber

                </DialogDescription>
                </DialogHeader>
                <div className="flex w-full items-end justify-end">
                    <Exportar author="pagar_vencidas"/>
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
                                {chartData && chartData['pagar_vencidas']?.map((e) => (
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