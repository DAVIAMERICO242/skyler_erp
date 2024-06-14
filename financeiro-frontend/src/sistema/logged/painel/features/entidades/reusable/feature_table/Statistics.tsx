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
import { useContas } from "../../Contas/local-contexts/contas-context";

const StatsContainer = styled.div`
    padding:30px;
`
const Static = styled.div`
    display:flex;
    align-items:center;
    gap:5px;
    margin-bottom:10px;
`

const Pagar = styled.div`
   color:rgb(218, 56, 50);
   font-weight:600;
   font-size:18px;
`

const Receber = styled.div`
   color:rgb(36, 205, 56);
   font-weight:600;
   font-size:18px;
`

export const Statistcs = ()=>{
    const data = useContas().data;
    const statistics = useContas().statistics;


    return(
        <StatsContainer>
            <Card>
                <CardHeader>
                    <CardTitle>Análise</CardTitle>
                    <CardDescription>Esse análise é com base nos dados filtrados/não filtrados da tabela abaixo, se, por exemplo, não houver nenhuma conta a resolver  no filtro ela não será somada aqui (NÃO LEVA EM CONTA IMPORTAÇÕES BANCÁRIAS).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Static>
                        <ChevronsRight />
                        Pago <i className="text-gray-500">(resolvido + parcial):</i>
                        <Pagar> {BRLReais(statistics?.pago)}</Pagar>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        Recebido <i className="text-gray-500">(resolvido + parcial):</i>
                        <Receber>{BRLReais(statistics?.recebido)}</Receber>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        A pagar <i className="text-gray-500">(não_resolvido + parcial_restante):</i>
                        <Pagar>{BRLReais(statistics?.a_pagar)}</Pagar>
                    </Static>
                    <Static>
                        <ChevronsRight />
                        A receber <i className="text-gray-500">(não_resolvido + parcial_restante):</i>
                        <Receber>{BRLReais(statistics?.a_receber)}</Receber>
                    </Static>
                </CardContent>
            </Card>
        </StatsContainer>
    )
}