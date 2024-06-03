import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';

export interface ContasData {
    pastid?:number;
    id?:number;
    data?: Date;
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
            const response = await fetch(BACKEND_URL + '/contas/get',{
                headers:{
                "Content-type":"application/json",
                "token":localStorage.getItem('token') as string
                }
            });
            const result = await response.json();
            console.log(result.data)
            setData(result.data);
            } catch (error) {
            console.log('erro')
            } 
    };


     useEffect(() => {
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