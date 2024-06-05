import { FeatureTitle } from '../reusable/FeatureTitle';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { BancosProvider } from '../Bancos/Bancos';
import BACKEND_URL from '@/sistema/backend-urls';
import { LoadingFeature } from '../reusable/LoadingFeature';
import { FeatureTable } from '../reusable/feature_table/FeatureTable';
import { NotFoundFeature } from '../reusable/NotFoundFeature';


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

  console.log("oi")
  return (
      <>
       <BancosProvider>
          <LojasProvider>
              <FeatureTitle>Gestão de lojas</FeatureTitle>
              <LojasUI/>
          </LojasProvider>
       </BancosProvider>
      </>
  )
}

export const LojasUI = ()=>{
  const [loading,setLoading] = useState(true);
  const [foundData,setFoundData] = useState(false);

  const thisContextData = useLojas().data;

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
        :foundData?(<FeatureTable author="lojas"/>):(<NotFoundFeature author="lojas"/>)}
    </> 
  )
}