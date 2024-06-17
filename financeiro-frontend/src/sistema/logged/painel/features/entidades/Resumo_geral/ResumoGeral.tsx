import {BasicLineChart, BasicPie, BasicBars, Charts } from './charts/Charts';
import {useEffect, useState} from 'react';
import { FeatureTitle } from '../reusable/FeatureTitle';
import { ChartDataProvider } from './chartsContext';


export  const ResumoGeral = ()=>{
    // const [faturado, setFaturado] = useState(0);
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [finalValue, setFinalValue] = useState(10040);
    // const animationDuration = 2000; // 2 seconds
  
    // useEffect(() => {
    //   const increment = finalValue / (animationDuration / 100); // Calculate increment per 10ms
    //   let currentFaturado = 0;
    //   const interval = setInterval(() => {
    //     currentFaturado += increment;
    //     if (currentFaturado >= finalValue) {
    //       clearInterval(interval);
    //       currentFaturado = finalValue;
    //     }
    //     setFaturado(currentFaturado);
    //   }, 10);
    //   return () => clearInterval(interval);
    // }, [finalValue]);

    return (
        <>
            <FeatureTitle>
                Resumo geral
            </FeatureTitle>
            <ChartDataProvider>
                <Charts/>
            </ChartDataProvider>

        </>
    )
}