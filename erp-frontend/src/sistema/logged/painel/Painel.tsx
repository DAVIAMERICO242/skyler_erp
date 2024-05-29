import { useState,useEffect} from "react";
import { checkAuth } from "../../auth/checkAuth";
import { LoadingAuth } from "../../auth/LoadingAuth";
import { useNavigate } from 'react-router-dom';
import { SideBar } from "./SideBar";
import { ResumoGeral } from "./features/Resumo_geral/ResumoGeral";
import { Lojas } from "./features/Lojas/Lojas";
import { Terceiros } from "./features/Terceiros/Terceiros";
import { Conciliacao } from "./features/Conciliacao/AnaliseDRE";
import { Bancos } from "./features/Bancos/Bancos";
import './css/main_position.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// eslint-disable-next-line
export const Painel = ()=>{

  
    const location = useLocation();

    const features:string[]= [
      "Resumo geral",
      "Terceiros",
      "Lojas",
      "Bancos",
      "Conciliação",
    ];

  //   const featureComponents: { [key: string]: JSX.Element } = {
  //     "Resumo geral": <ResumoGeral />,
  //     "Terceiros": <Terceiros />,
  //     "Lojas": <Lojas />,
  //     "Bancos": <Bancos />,
  //     "Conciliação": <Conciliacao />,
  // };

    const [fatherToggle,setFatherToggle] = useState<boolean>(false);
    const [focusedFeature,setFocusedFeature] = useState<string>("Resumo geral");

    const navigateTo = useNavigate();
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        checkAuth()
        .then(()=>{setIsLoading(false)})
        .catch(()=>{setIsLoading(false);navigateTo('/login')})
    },[]);

    useEffect(()=>{
      navigateTo(focusedFeature);
      console.log(focusedFeature)
      console.log('FATHER TOGGLE');
      console.log(fatherToggle);
      console.log('LOCATION');
      console.log(location.pathname.split('/')[location.pathname.split('/').length-1])
    },[focusedFeature,fatherToggle]);

    return (
        <div>
          {isLoading ? (
            <LoadingAuth />
          ) : (
            <div className="main_flex">
              <SideBar 
              features={features}
              focusedFeature={focusedFeature}
              setFocusedFeature={setFocusedFeature}
              setFatherToggle={setFatherToggle}
              />
              <div className={"main " + (fatherToggle?'toggled':'')}>
              <Routes>
                {/* CAMINHO RELATIVO A ROTA ATUAL */}
                <Route path="Resumo Geral" element={<ResumoGeral/>} />
                <Route path="Terceiros" element={<Terceiros />} />
                <Route path="Lojas" element={<Lojas />} />
                <Route path="Bancos" element={<Bancos />} />
                <Route path="Conciliação" element={<Conciliacao />} />
              </Routes>
              </div>
            </div>
          )}
        </div>
      );
}