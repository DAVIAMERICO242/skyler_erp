import styled from "styled-components";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ChevronsRight } from "lucide-react";
//as estatisticas consomem o provedor de contas 
import { BRLReais } from "@/sistema/essentials";

const StatsContainer = styled.div`
    padding:30px;
`
const Static = styled.div`
    display:flex;
    align-items:center;
    gap:5px;
    margin-bottom:10px;
`

const Money = styled.div`
   color:rgb(36, 205, 56);
   font-weight:600;
   font-size:18px;
`

export const Statistcs = ()=>{
    return(
        <StatsContainer>
            <Card>
                <CardHeader>
                    <CardTitle>Análise</CardTitle>
                    <CardDescription>Esse análise é com base nos dados filtrados da tabela abaixo, se não houver, por exemplo, nenhuma conta a resolver no filtro não será somada aqui (NÃO LEVA EM CONTA IMPORTAÇÕES BANCÁRIAS).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Static>
                        <ChevronsRight />
                        Pago <i className="text-gray-500">(resolvido + parcial):</i>
                        <Money>{BRLReais(785)}</Money>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        Recebido <i className="text-gray-500">(resolvido + parcial):</i>
                        <Money>{BRLReais(785)}</Money>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        A pagar <i className="text-gray-500">(não_resolvido + parcial_restante):</i>
                        <Money>{BRLReais(785)}</Money>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        A receber <i className="text-gray-500">(não_resolvido + parcial_restante):</i>
                        <Money>{BRLReais(785)}</Money>
                    </Static>
                </CardContent>
            </Card>
        </StatsContainer>
    )
}