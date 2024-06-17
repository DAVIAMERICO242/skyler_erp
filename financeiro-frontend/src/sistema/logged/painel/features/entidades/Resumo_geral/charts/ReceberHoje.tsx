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

import styled from "styled-components";
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
  } from "@/components/ui/table"
import { BRLReais, SubtractColumns, TZtoFriendlyDate } from "@/sistema/essentials";
import { Exportar } from "./Exportar";

const ReceberHojeContainer = styled.div`
    color:white;
    height:300px;
    border-radius:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    background-color:rgb(95, 239, 85);
    transition:all 0.2s ease;
    box-shadow: rgba(90, 241, 102, 0.25) 0px 50px 100px -20px, rgba(26, 211, 84, 0.3) 0px 30px 60px -30px;
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
    overflow:auto;
`

export const ReceberHoje = ()=>{
    
    const fetchRequiredChart = useCharts().fetchRequiredChart;

    useEffect(()=>{
        fetchRequiredChart('a_receber_hoje');
    },[]);

    const [receberHoje, setReceberHoje] = useState<{
                                                vencimento?: string;
                                                terceiro?: string;
                                                valor?: number;
                                                valor_resolucao?: number;
                                            }[] | undefined>(undefined);

    const chartData = useCharts()?.chartData;

    useEffect(()=>{
        console.log(chartData);
        if(chartData && chartData['a_receber_hoje']){
            setReceberHoje(chartData['a_receber_hoje']);
        }
    },[chartData]);

    return(
        <Dialog>
            <DialogTrigger className="w-full">
                <ReceberHojeContainer>
                    <h2>A receber hoje</h2>
                    <h1>{chartData && BRLReais(SubtractColumns(chartData['a_receber_hoje'],'valor','valor_resolucao'))}</h1>
                </ReceberHojeContainer>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>A receber hoje</DialogTitle>
                <DialogDescription>
                Veja com mais detalhes em contas a pagar / receber

                </DialogDescription>
                </DialogHeader>
                <div className="flex w-full items-end justify-end">
                    <Exportar author="a_receber_hoje"/>
                </div>
                <TableLimiter>
                    <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead className="w-[100px]">Vencimento</TableHead>
                                <TableHead className="w-[100px]">Terceiro</TableHead>
                                <TableHead className="w-[100px]">Valor necessário</TableHead>
                                <TableHead className="text-right">Valor pago</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData && chartData['a_receber_hoje']?.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.id}</TableCell>
                                    <TableCell>{TZtoFriendlyDate(e.vencimento)}</TableCell>
                                    <TableCell>{e.terceiro}</TableCell>
                                    <TableCell>{BRLReais(e.valor)}</TableCell>
                                    <TableCell className="text-right">{BRLReais(e.valor_resolucao)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                    </Table>
                </TableLimiter>
            </DialogContent>
        </Dialog>
    )
}
