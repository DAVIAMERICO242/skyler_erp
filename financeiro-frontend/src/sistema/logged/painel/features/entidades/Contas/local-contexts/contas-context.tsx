import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getContas } from '../../BackendHelper/API/fetch';

export interface SchemaContasFrontendData {
    pastid?:number;
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
}

interface ContasContextType {
    data: SchemaContasFrontendData[] | null;
    refetch: () => void;
}

const ContasContext = createContext<ContasContextType>({ data: null,refetch: () => {} });

export const ContasProvider = ({ children }:{children:ReactNode}) => {
    const [data, setData] = useState<SchemaContasFrontendData[] | null>(null);

    const fetchData = async () => {
            try {
            const response = await getContas();
            setData(response);
            } catch (error) {
            console.log('erro')
            } 
    };


     useEffect(() => {
        console.log('REFETCHADO')
        fetchData();
    }, []);

    const refetch = () => {
        fetchData();
    };

     return (
        <ContasContext.Provider value={{data,refetch}}>
            {children}
        </ContasContext.Provider>
    );
};

export const useContas = () => {
    return useContext(ContasContext);
};