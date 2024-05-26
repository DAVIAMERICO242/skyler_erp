import { useState,useEffect} from "react";
import { checkAuth } from "../../auth/checkAuth";
import { LoadingAuth } from "../../auth/LoadingAuth";
import { useNavigate } from 'react-router-dom';
import { SideBar } from "./SideBar";
import { ResumoGeral } from "./features/Resumo_geral/ResumoGeral";
import { CadastroTerceiros } from "./features/Cadastro_de_terceiros/CadastroTerceiros";
import { AnaliseLoja } from "./features/Análise_por_loja/AnaliseLoja";
import { AnaliseVendedor } from "./features/Análise_por_vendedor/AnaliseVendedor";
import { AnaliseDRE } from "./features/Analisar_DRE/AnaliseDRE";
import { Integracao } from "./features/Integração/Integracao";
import './css/main_position.css';


export const Painel = ()=>{
    
    const features:string[]= [
      "Resumo geral",
      "Cadastro de terceiros",
      "Análise por loja",
      "Análise por vendedor",
      "Analisar DRE",
      "Integração"
    ];

    const featureComponents: { [key: string]: JSX.Element } = {
      "Resumo geral": <ResumoGeral />,
      "Cadastro de terceiros": <CadastroTerceiros />,
      "Análise por loja": <AnaliseLoja />,
      "Análise por vendedor": <AnaliseVendedor />,
      "Analisar DRE": <AnaliseDRE />,
      "Integração": <Integracao />
  };

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
      console.log(focusedFeature)
      console.log('FATHER TOGGLE');
      console.log(fatherToggle);
    },[focusedFeature,fatherToggle]);


    return (
        <div>
          {isLoading ? (
            <LoadingAuth />
          ) : (
            <div className="main_flex">
              <SideBar features={features}
              setFocusedFeature={setFocusedFeature}
              setFatherToggle={setFatherToggle}
              />
              <div className={"main " + (fatherToggle?'toggled':'')}>
                {featureComponents[focusedFeature]}
              </div>
            </div>
          )}
        </div>
      );
}