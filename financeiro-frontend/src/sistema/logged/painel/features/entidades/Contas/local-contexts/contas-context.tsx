import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getContas } from '../../API/fetch';

export interface ContasData {
    pastid?:number;
    id?:number;
    data?: string;
    vencimento?: Date;
    conta_tipo?: string;
    terceiro?:string;
    valor?:number;
    situacao?:string;
}

interface ContasContextType {
    data: ContasData[] | null;
    refetch: () => void;
}

const ContasContext = createContext<ContasContextType>({ data: null,refetch: () => {} });

export const ContasProvider = ({ children }:{children:ReactNode}) => {
    const [data, setData] = useState<ContasData[] | null>(null);

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