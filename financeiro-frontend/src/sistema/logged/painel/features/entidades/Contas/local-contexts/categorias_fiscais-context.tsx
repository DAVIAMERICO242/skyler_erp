import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getCategoriasFiscais } from '../../API/fetch';

export interface CategoriasFiscaisData {
    nome_conta?:string;
    categoria_conta?:string;
    indice?:number;
    pagar_receber?:string;
}

interface CategoriasFiscaisContextType {
    data: CategoriasFiscaisData[] | null;
    refetch: () => void;
}

const CategoriasFiscaisContext = createContext<CategoriasFiscaisContextType>({ data: null,refetch: () => {} });

export const CategoriasFiscaisProvider = ({ children }:{children:ReactNode}) => {
    const [data, setData] = useState<CategoriasFiscaisData[] | null>(null);

    const fetchData = async () => {
            try {
            const response = await getCategoriasFiscais();
            setData(response);
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
        <CategoriasFiscaisContext.Provider value={{data,refetch}}>
            {children}
        </CategoriasFiscaisContext.Provider>
    );
};

export const useCategoriasFiscais = () => {
    return useContext(CategoriasFiscaisContext);
};