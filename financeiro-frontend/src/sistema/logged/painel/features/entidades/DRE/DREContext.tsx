import {useContext,createContext, useState, useEffect} from 'react';
import {Dispatch, ReactNode, SetStateAction } from "react";
import { getDRE } from '../BackendHelper/API/fetch';


export interface DREFilterObject{
    tipo_data: ("competencia"|"vencimento"|"pagamento"),
    data_inicio:string,
    data_fim:string,
}

export interface theDRE{
    nome_loja?:string,//loja resolucao
    categoria_fiscal?:string,
    pagar_receber?:string,
    RESULTADO?:string
}

interface DREContext{
    DREData: theDRE[] | undefined,
    setDREData:Dispatch<SetStateAction<theDRE[] | undefined>>,
    refecthDRE:()=>{}
}

const DREContext = createContext<DREContext>({
    DREData:undefined,
    setDREData:()=>{},
    refecthDRE:()=>{}
});

export const DREProvider = ({children}:{children:ReactNode})=>{
    const [DREData,setDREData] = useState<undefined | theDRE[]>(undefined);

    const fetchDRE = async(filter={tipo_data:"pagamento",data_inicio:'1900-01-01',data_fim:(new Date()).toISOString()} as DREFilterObject)=>{
        return getDRE(filter).then((d)=>d.json()).
        then((d)=>{
            console.log(d);
            setDREData(d.data);
        })
    }

    const refecthDRE = async(filter:DREFilterObject)=>{
        return fetchDRE(filter);
    }

    useEffect(()=>{
        fetchDRE();
    },[])

    return(
        <DREContext.Provider value={{DREData,setDREData,refecthDRE}}>
            {children}
        </DREContext.Provider>
    )
}

export const useDRE = ()=>{
    return useContext(DREContext);
}
