import { FeatureTitle } from '../reusable/FeatureTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BancosForm } from './BancosForm';
import BACKEND_URL from '@/sistema/backend-urls';
import { createContext, ReactNode, useState, useEffect, useContext } from 'react';

export interface BancosData {
    nome_banco?:string;
    banco?: string;
    agencia?: string;
    conta?: string;
    saldo_inicial:number;
}

interface BancosContextType {
    data: BancosData[] | null;
    refetch: () => void;
}

const BancosContext = createContext<BancosContextType>({ data: null,refetch: () => {} });

export const BancosProvider = ({ children }:{children:ReactNode}) => {
const [data, setData] = useState<BancosData[] | null>(null);

const fetchData = async () => {
        try {
        const response = await fetch(BACKEND_URL + '/bancos/get',{
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
    <BancosContext.Provider value={{data,refetch}}>
        {children}
    </BancosContext.Provider>
);
};

export const useBancos = () => {
    return useContext(BancosContext);
};

export const Bancos = ()=>{

    return (
        <>
            <BancosProvider>
                <FeatureTitle>Gerenciar bancos</FeatureTitle>
                <Tabs defaultValue="cadastro" className="space-y-8 2xl:w-[30%] md:w-[45%] sm:w-[55%] w-[80%] mt-[5%]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                    <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
                </TabsList>
                <TabsContent value="cadastro">
                    <BancosForm edit={false}/>
                </TabsContent>
                <TabsContent value="gerenciar">
                </TabsContent>
                </Tabs>
            </BancosProvider>
        </>
    )
}