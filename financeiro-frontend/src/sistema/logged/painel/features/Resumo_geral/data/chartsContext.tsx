import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { ReactNode } from "react";



interface ChartsSchema{
    a_pagar_hoje?:number,
    a_receber_hoje?:number,
    vencidos_a_pagar?:number,//parciais+não resolvidos onde data de vencimento > NOW
    vencidos_a_receber?:number
}

interface ChartsContext{
    chartData?:ChartsSchema,
    setChartData?:  Dispatch<SetStateAction<ChartsSchema | undefined>>;
}

const ChartContext = createContext<ChartsContext>({});

export const ChartDataProvider = ({children}:{children:ReactNode})=>{
    const [chartData,setChartData] = useState<ChartsSchema | undefined>(undefined);

    return (
        <ChartContext.Provider value={{chartData,setChartData}}>
            {children}
        </ChartContext.Provider>
    )
}

export const useCharts = ()=>{
    return(
        useContext(ChartContext)
    )
}

