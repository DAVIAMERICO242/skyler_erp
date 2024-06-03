import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';

export interface CategoriasFiscaisData {
    nome_conta?:string;
    categoria_conta?:string;
    indice?:number;
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
            const response = await fetch(BACKEND_URL + '/categorias_fiscais/get',{
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
        <CategoriasFiscaisContext.Provider value={{data,refetch}}>
            {children}
        </CategoriasFiscaisContext.Provider>
    );
};

export const useCategoriasFiscais = () => {
    return useContext(CategoriasFiscaisContext);
};