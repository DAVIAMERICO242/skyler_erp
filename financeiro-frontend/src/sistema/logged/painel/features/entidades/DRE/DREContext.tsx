/* eslint-disable @typescript-eslint/no-explicit-any */
import {useContext,createContext, useState, useEffect} from 'react';
import {Dispatch, ReactNode, SetStateAction } from "react";
import { getDRE } from '../BackendHelper/API/fetch';



export interface theDRE{
    nome_loja?:string,//loja resolucao
    categoria_fiscal?:string,
    pagar_receber?:string,
    RESULTADO?:string
}

interface DREContext{
    DREData: theDRE[] | undefined,
    setDREData:Dispatch<SetStateAction<theDRE[] | undefined>>,
    DREFilter:any,
    setDREFilter:any,
    refecthDRE:()=>{},
    successFilter:DREFilterObject,
    setSuccessFilter:Dispatch<SetStateAction<DREFilterObject>>,

}
export interface DREFilterObject{
    tipo_data: ("competencia"|"vencimento"|"pagamento_previsao"|"pagamento_real"),
    data_inicio:string,
    data_fim:string,
}

const DREContext = createContext<DREContext>({
    DREData:undefined,
    setDREData:()=>{},
    DREFilter:{},
    setDREFilter:{},
    refecthDRE:()=>{},
    successFilter:{tipo_data:"pagamento_previsao",data_inicio:(new Date(new Date().getFullYear(), 0, 1)).toISOString(),data_fim:(new Date(new Date().getFullYear(), 11, 31)).toISOString()},
    setSuccessFilter:()=>{}
});

export const DREProvider = ({children}:{children:ReactNode})=>{
    const [DREData,setDREData] = useState<undefined | theDRE[]>(undefined);
    const [DREFilter, setDREFilter] = useState(undefined);
    const [successFilter, setSuccessFilter] = useState<DREFilterObject>(
        {tipo_data:"pagamento_previsao",data_inicio:(new Date(new Date().getFullYear(), 0, 1)).toISOString(),data_fim:(new Date(new Date().getFullYear(), 11, 31)).toISOString()}
    )

    const fetchDRE = async(filter={tipo_data:"pagamento_previsao",data_inicio:(new Date(new Date().getFullYear(), 0, 1)).toISOString(),data_fim:(new Date(new Date().getFullYear(), 11, 31)).toISOString()} as DREFilterObject)=>{
        return getDRE(filter).then((d)=>d.json()).
        then((d)=>{
            console.log(d);
            setDREData(d.data);
            setDREFilter(filter);
            setSuccessFilter(filter);
        })
    }

    const refecthDRE = async(filter:DREFilterObject)=>{
        return fetchDRE(filter);
    }

    useEffect(()=>{
        fetchDRE();
    },[])

    return(
        <DREContext.Provider value={{DREData,setDREData,DREFilter,setDREFilter,refecthDRE,successFilter,setSuccessFilter}}>
            {children}
        </DREContext.Provider>
    )
}

export const useDRE = ()=>{
    return useContext(DREContext);
}
