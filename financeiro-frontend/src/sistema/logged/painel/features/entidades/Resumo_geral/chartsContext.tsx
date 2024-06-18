/* eslint-disable react-refresh/only-export-components */
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import BACKEND_URL from "@/sistema/backend-urls";

interface ChartsSchema {
    [author: string]: {
        id?:number;
        vencimento?: string;
        terceiro?: string;
        valor?: number;
        valor_resolucao?: number;
    }[];
}

interface ChartsContext{
    chartData?:ChartsSchema,
    setChartData?:  Dispatch<SetStateAction<ChartsSchema | undefined>>;
    fetchRequiredChart: (author: "a_pagar_hoje" | "a_receber_hoje" | "pagar_vencidas" | "receber_vencidas") => void
}

const ChartContext = createContext<ChartsContext>({});

export const ChartDataProvider = ({children}:{children:ReactNode})=>{
    const [chartData,setChartData] = useState<ChartsSchema | undefined>(undefined);

    function fetchRequiredChart(author:"a_pagar_hoje" | "a_receber_hoje" | "pagar_vencidas" | "receber_vencidas"){
        console.log('CHART DATA INSIDE FETCH FUNCTION')
        console.log(chartData)
        return fetch(BACKEND_URL + `/resumo?author=${author}`,{
            headers:{
                "Content-type":"application/json",
                "token":localStorage.getItem('token') as string
            }
        }).then((d)=>d.json()).then((d)=>{
            console.log('CHART DATA INSIDE THEN')
            console.log(chartData)
            setChartData((prev)=>({...prev, [author]:d?.data}))
        })
    }

    useEffect(()=>{
        console.log('CICLO DE VIDA CHARTS DATA');
        console.log(chartData);

    },[chartData])

    return (
        <ChartContext.Provider value={{chartData,setChartData, fetchRequiredChart}}>
            {children}
        </ChartContext.Provider>
    )
}

export const useCharts = ()=>{
    return(
        useContext(ChartContext)
    )
}

