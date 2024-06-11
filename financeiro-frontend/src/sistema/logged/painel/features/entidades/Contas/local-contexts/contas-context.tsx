/* eslint-disable @typescript-eslint/no-unused-vars */
import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getContas } from '../../BackendHelper/API/fetch';

export interface SchemaContasFrontendData {
    pastid?:number;
    situacao?:string;
    id?:number,
    data?:string,
    vencimento?:string,
    conta_tipo?: string;
    pagar_receber:string;
    terceiro?:string,
    valor?:number,
    data_resolucao?:string,
    valor_resolucao?:number,
    nossa_conta_bancaria?:string,
    nome_loja:string
}

export interface SchemaContasFilterObject{
    categoria_conta?:string[],
    conta_tipo?: string[],
    data?:string[],
    data_resolucao?:string[],
    id?:number[],
    nome_loja:string[],
    situacao?:string[],
    vencimento?:string[],
    pagar_receber:string[],
    terceiro?:string[],
    valor?:number[],
    valor_resolucao?:number[],
    nossa_conta_bancaria?:string[],
}

interface ContasContextType {
    data: SchemaContasFrontendData[] | null;
    n_pages:number;
    refetch: () => void;
}

const ContasContext = createContext<ContasContextType>({ data: null,refetch: () => {} });

export const ContasProvider = ({ children }:{children:ReactNode}) => {
    const [data, setData] = useState<SchemaContasFrontendData[] | null>(null);
    const [n_pages,setN_pages] = useState<number>(0);

    const fetchData = async (page:number = 1, filterObject?:SchemaContasFilterObject) => {//vai ter filtro
            try {
            const response = await getContas(page, filterObject);
            setData(response?.data);
            setN_pages(response?.n_pages);
            } catch (error) {
            console.log('erro')
            } 
    };

     useEffect(() => {
        console.log('REFETCHADO')
        fetchData();
    }, []);

    const refetch = (page:number = 1, filterObject?:SchemaContasFilterObject) => {
        return fetchData(page, filterObject);
    };

     return (
        <ContasContext.Provider value={{data,n_pages,refetch}}>
            {children}
        </ContasContext.Provider>
    );
};

export const useContas = () => {
    return useContext(ContasContext);
};