import { FeatureTitle } from '../reusable/FeatureTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Gerenciar } from '../reusable/Gerenciar';
import { TerceirosForm } from './TerceirosForm';
import { createContext } from 'react';
import { useEffect,useState,useContext } from 'react';
import { ReactNode } from 'react';
import BACKEND_URL from '@/sistema/backend-urls';


interface TerceirosData {
  nome: string;
  cnpj_cpf: string;
  tipo: string;
  estado: string;
}

interface TerceirosContextType {
  data: TerceirosData[] | null;
}

const TerceirosContext = createContext<TerceirosContextType>({ data: null });

export const TerceirosProvider = ({ children }:{children:ReactNode}) => {
  const [data, setData] = useState<TerceirosData[] | null>(null);

  useEffect(() => {
    // Função para buscar dados da API
    const fetchData = async () => {
      try {
        const response = await fetch(BACKEND_URL + '/terceiros/get',{
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

    fetchData();
  }, []);

  return (
    <TerceirosContext.Provider value={{data}}>
      {children}
    </TerceirosContext.Provider>
  );
};

export const useTerceiros = () => {
  return useContext(TerceirosContext);
};

export const Terceiros = ()=>{

    return (
        <>
          <TerceirosProvider>
            <FeatureTitle>Gestão de terceiros</FeatureTitle>
            <Tabs defaultValue="cadastro" className="space-y-8 2xl:w-[30%] md:w-[45%] sm:w-[55%] w-[80%] mt-[5%]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                    <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
                </TabsList>
                <TabsContent value="cadastro">
                  <TerceirosForm edit={false}/>
                </TabsContent>
                <TabsContent value="gerenciar">
                  <Gerenciar author="terceiros"/>
                </TabsContent>
            </Tabs>
          </TerceirosProvider>
        </>
    )
}