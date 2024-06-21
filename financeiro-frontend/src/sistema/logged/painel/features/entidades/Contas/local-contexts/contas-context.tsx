/* eslint-disable @typescript-eslint/no-unused-vars */
import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getContas } from '../../BackendHelper/API/fetch';
import { SchemaContasFilterObject } from '../../reusable/feature_table/filter/contas/ContextFilterContas';

export interface SchemaContasFrontendData {
    pastid?:number;
    situacao?:string;
    id?:number,
    data?:string,
    vencimento?:string,
    competencia?:string,
    conta_tipo?: string;
    pagar_receber:string;
    terceiro?:string,
    loja?:string,
    valor?:number,
    data_resolucao?:string,
    valor_resolucao?:number,
    nossa_conta_bancaria?:string,
}


interface ContasContextType {
    data: SchemaContasFrontendData[] | null;
    statistics: statistics | null;
    n_pages:number;
    refetch: () => void;
}

interface statistics {
    pago?:number,
    recebido?:number,
    a_pagar?:number,
    a_receber?:number
}

const ContasContext = createContext<ContasContextType>({ data: null,refetch: () => {} });

export const ContasProvider = ({ children }:{children:ReactNode}) => {
    const [data, setData] = useState<SchemaContasFrontendData[] | null>(null);
    const [statistics,setstatistics] = useState<statistics | null>(null);
    const [n_pages,setN_pages] = useState<number>(0);
    const fetchData = async (page:number = 1, filter?:SchemaContasFilterObject) => {//vai ter filtro
            try {
                const response = await getContas(page,filter);
                if(response?.data?.length && filter){//se tiver filtrado, so vai mudar os dados atuais se foi achado filtro
                    setData(response?.data);
                    setstatistics(response?.statistics)
                    setN_pages(response?.n_pages);
                }else if(!filter){// se nao tiver filtrado vai atualizar os dados de qualquer forma, serve pra UX de quando nao tem dados
                    setData(response?.data);
                    setstatistics(response?.statistics)
                    setN_pages(response?.n_pages);      
                }
                return response;
            } catch (error) {
                console.log('erro')
            } 
    };

    useEffect(() => {
        console.log('REFETCHADO')
        fetchData();
    }, []);

    const refetch = (page:number = 1, filter?:SchemaContasFilterObject) => {
        return fetchData(page,filter);
    };

     return (
        <ContasContext.Provider value={{data,statistics,n_pages,refetch}}>
            {children}
        </ContasContext.Provider>
    );
};

export const useContas = () => {
    return useContext(ContasContext);
};