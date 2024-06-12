import { FeatureTitle } from '../reusable/FeatureTitle';
import { TerceirosProvider } from '../Terceiros/Terceiros';
import { CategoriasFiscaisProvider, useCategoriasFiscais } from './local-contexts/categorias_fiscais-context';
import { ContasProvider, useContas } from './local-contexts/contas-context';
import { LoadingFeature } from '../reusable/LoadingFeature';
import { FeatureTable } from '../reusable/feature_table/FeatureTable';
import { NotFoundFeature } from '../reusable/NotFoundFeature';
import { useEffect, useState } from 'react';
import { LojasProvider } from '../Lojas/Lojas';

export const Contas = ()=>{
    return(
            <CategoriasFiscaisProvider>
                <ContasProvider>
                    <TerceirosProvider>
                      <LojasProvider>
                        <FeatureTitle>Contas</FeatureTitle>
                        <ContasUI/>
                      </LojasProvider>
                    </TerceirosProvider>
                </ContasProvider>
            </CategoriasFiscaisProvider>
    )
}

export const ContasUI = ()=>{
    const [loading,setLoading] = useState(true);
    const [foundData,setFoundData] = useState(false);//se existe algum dado nao filtrado

    const thisContextDataPart1 = useCategoriasFiscais().data;
    const thisContextDataPart2 = useContas().data;

    useEffect(()=>{

      if(thisContextDataPart1!==null){
        setLoading(false);
        if(thisContextDataPart1?.length){
          setFoundData(true);
        }else{
          setFoundData(false);
        }
      }

      if(thisContextDataPart2!==null){
        setLoading(false);
        if(thisContextDataPart2?.length){
          setFoundData(true);
        }else{
          setFoundData(false);
        }
      }

    },[thisContextDataPart1,thisContextDataPart2]);
    
    return(
        <>
          {loading?<LoadingFeature/>
            :foundData?(<FeatureTable author="contas"/>):(<NotFoundFeature author="contas"/>)}
        </> 
      )
}