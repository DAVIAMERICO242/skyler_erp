import { FeatureTitle } from '../reusable/FeatureTitle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


import { createContext } from 'react';
import { useEffect,useState,useContext } from 'react';
import { ReactNode } from 'react';
import BACKEND_URL from '@/sistema/backend-urls';
import { LoadingFeature } from '../reusable/LoadingFeature';
import { NotFoundFeature } from '../reusable/NotFoundFeature';
import { FeatureTable } from '../reusable/feature_table/FeatureTable';

export interface TerceirosData {
  nome?: string;
  cnpj_cpf?: string;
  tipo?: string;
  estado?: string;
}

interface TerceirosContextType {
  data: TerceirosData[] | null;
  refetch: () => void;
}

const TerceirosContext = createContext<TerceirosContextType>({ data: null,refetch: () => {} });

export const TerceirosProvider = ({ children }:{children:ReactNode}) => {
  const [data, setData] = useState<TerceirosData[] | null>(null);

  console.log('renderizou terceiros provider');
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


  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return (
    <TerceirosContext.Provider value={{data,refetch}}>
      {children}
    </TerceirosContext.Provider>
  );
};

export const useTerceiros = () => {
  return useContext(TerceirosContext);
};

export const Terceiros = ()=>{

    console.log("oi")
    return (
        <>
           <TerceirosProvider>
              <FeatureTitle>Gestão de terceiros</FeatureTitle>
              <TerceirosUI/>
           </TerceirosProvider>
        </>
    )
}

export const TerceirosUI = ()=>{
    const [loading,setLoading] = useState(true);
    const [foundData,setFoundData] = useState(false);

    const thisContextData = useTerceiros().data;

    useEffect(()=>{
      if(thisContextData!==null){
        setLoading(false);
        if(thisContextData?.length){
          setFoundData(true);
        }else{
          setFoundData(false);
        }
      }
    },[thisContextData])
    
    return(
      <>
        {loading?<LoadingFeature/>
          :foundData?(<FeatureTable author="terceiros"/>):(<NotFoundFeature author="terceiros"/>)}
      </> 
    )
}