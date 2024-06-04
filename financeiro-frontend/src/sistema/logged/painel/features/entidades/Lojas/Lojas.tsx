import { FeatureTitle } from '../reusable/FeatureTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Gerenciar } from '../reusable/Gerenciar';
import { LojasForm } from './LojasForm';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { BancosProvider } from '../Bancos/Bancos';
import BACKEND_URL from '@/sistema/backend-urls';


export interface LojasData {
  conta?:string,
  nome?:string,
  razao?:string,
  cnpj?:string
}

interface lojasContextType {
  data: LojasData[] | null;
  refetch: () => void;
}


const LojasContext = createContext<lojasContextType>({ data: null,refetch: () => {} });

export const LojasProvider = ({ children }:{children:ReactNode}) => {
  const [data, setData] = useState<LojasData[] | null>(null);

  const fetchData = async () => {
        try {
          const response = await fetch(BACKEND_URL + '/lojas/get',{
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
    <LojasContext.Provider value={{data,refetch}}>
      {children}
    </LojasContext.Provider>
  );
};

export const useLojas = () => {
  return useContext(LojasContext);
};

export const Lojas = ()=>{
    
    return (
        <>
        <BancosProvider>
          <LojasProvider>
            <FeatureTitle>Gestão de lojas</FeatureTitle>
            <Tabs defaultValue="cadastro" className="space-y-8 2xl:w-[30%] md:w-[45%] sm:w-[55%] w-[80%] mt-[5%]">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                  <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
              </TabsList>
              <TabsContent value="cadastro">
                <LojasForm edit={false}/>
              </TabsContent>
              <TabsContent value="gerenciar">
                <Gerenciar author="lojas"/>
              </TabsContent>
            </Tabs>
          </LojasProvider>
        </BancosProvider>
        </>
    )
}