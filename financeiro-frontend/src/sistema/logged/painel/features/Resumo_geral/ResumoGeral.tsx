import '../../css/ResumoGeral.css';
import {BasicLineChart, BasicPie, BasicBars } from './Charts';
import {useEffect, useState} from 'react';
import { FeatureTitle } from '../entidades/reusable/FeatureTitle';

export  const ResumoGeral = ()=>{
    const [faturado, setFaturado] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [finalValue, setFinalValue] = useState(10040);
    const animationDuration = 2000; // 2 seconds
  
    useEffect(() => {
      const increment = finalValue / (animationDuration / 100); // Calculate increment per 10ms
      let currentFaturado = 0;
      const interval = setInterval(() => {
        currentFaturado += increment;
        if (currentFaturado >= finalValue) {
          clearInterval(interval);
          currentFaturado = finalValue;
        }
        setFaturado(currentFaturado);
      }, 10);
      return () => clearInterval(interval);
    }, [finalValue]);

    return (
        <>
            <FeatureTitle>
                Resumo geral
            </FeatureTitle>
            <div className="resumo-graphs">
                <div className="graph graph1">
                    <h1>Esse mês</h1>
                    <div className="faturado">
                        +R$ {faturado.toFixed(2)}
                    </div>
                </div>
                <div className="graph graph2">
                    <h1>Venda diária no mês</h1>
                    <BasicLineChart/>
                </div>
                <div className="graph graph3">
                    <h1>Ativos vs passivos</h1>
                    <BasicPie/>
                </div>
                <div className="graph graph4">
                    <h1>Lojas com mais vendas</h1>
                    <BasicBars/>
                </div>
            </div>

        </>
    )
}