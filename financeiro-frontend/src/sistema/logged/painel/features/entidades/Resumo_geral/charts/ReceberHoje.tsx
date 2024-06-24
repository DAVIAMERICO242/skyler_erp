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
    animation: fadeInXFromRight 0.5s ease;
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
    overflow-y:auto;
`

export const ReceberHoje = ()=>{

    const [loading,setLoading] = useState(true);
    
    const fetchRequiredChart = useCharts().fetchRequiredChart;

    useEffect(()=>{
        setLoading(true);
        fetchRequiredChart('a_receber_hoje').then(()=>{
            setLoading(false)
        }).catch(()=>{
            setLoading(false)
        });
    },[]);

    const [receberHoje, setReceberHoje] = useState<{
                                                previsao?: string;
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
                    <h2>Previstas a receber hoje</h2>
                    <h1>{!loading?(chartData && BRLReais(SubtractColumns(chartData['a_receber_hoje'],'valor','valor_resolucao'))):"carregando..."}</h1>
                </ReceberHojeContainer>
            </DialogTrigger>
            <DialogContent className="min-w-[800px]">
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
                                <TableHead className="w-[100px]">Previsão</TableHead>
                                <TableHead className="w-[100px]">Terceiro</TableHead>
                                <TableHead className="w-[100px]">Valor necessário</TableHead>
                                <TableHead className="w-[100px]">Valor pago</TableHead>
                                <TableHead className="w-[100px]">Restante</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData && chartData['a_receber_hoje']?.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.id}</TableCell>
                                    <TableCell>{TZtoFriendlyDate(e.previsao)}</TableCell>
                                    <TableCell>{e.terceiro}</TableCell>
                                    <TableCell>{BRLReais(e.valor)}</TableCell>
                                    <TableCell>{BRLReais(e.valor_resolucao)}</TableCell>
                                    <TableCell>{BRLReais(e.valor - e.valor_resolucao)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                    </Table>
                </TableLimiter>
            </DialogContent>
        </Dialog>
    )
}
