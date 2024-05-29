import { useState,useEffect} from "react";
import { checkAuth } from "../../auth/checkAuth";
import { LoadingAuth } from "../../auth/LoadingAuth";
import { useNavigate } from 'react-router-dom';
import { SideBar } from "./SideBar";
import { ResumoGeral } from "./features/Resumo_geral/ResumoGeral";
import { Lojas } from "./features/entidades/Lojas/Lojas";
import { Terceiros } from "./features/entidades/Terceiros/Terceiros";
import { Conciliacao } from "./features/Conciliacao/AnaliseDRE";
import { Bancos } from "./features/entidades/Bancos/Bancos";
import './css/main_position.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { convertToPARAM } from "@/sistema/essentials";
// eslint-disable-next-line
export const Painel = ()=>{

    const {feature} = useParams();

    console.log('URL FEATURE');
    console.log(feature)

    const location = useLocation();

    const features:string[]= [
      "Resumo geral",
      "Terceiros",
      "Lojas",
      "Bancos",
      "Conciliação",
    ];

    const featuresToPARAM: { [key: string]: string } = {
      "Resumo geral": "resumo_geral",
      "Terceiros": "terceiros",
      "Lojas": "lojas",
      "Bancos": "bancos",
      "Conciliação":"conciliacao"
    }

    const PARAMSTofeature: { [key: string]: string } = {
      "resumo_geral": "Resumo geral",
      "terceiros":"Terceiros",
      "lojas":"Lojas",
      "bancos":"Bancos",
      "conciliacao":"Conciliação"
    }

  //   const featureComponents: { [key: string]: JSX.Element } = {
  //     "Resumo geral": <ResumoGeral />,
  //     "Terceiros": <Terceiros />,
  //     "Lojas": <Lojas />,
  //     "Bancos": <Bancos />,
  //     "Conciliação": <Conciliacao />,
  // };

    const [fatherToggle,setFatherToggle] = useState<boolean>(false);
    const [focusedFeature,setFocusedFeature] = useState<string>(feature?PARAMSTofeature[feature]:"Resumo geral");

    const navigateTo = useNavigate();
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        checkAuth()
        .then(()=>{setIsLoading(false)})
        .catch(()=>{setIsLoading(false);navigateTo('/login')})
    },[]);

    useEffect(()=>{
      navigateTo("/painel/" + featuresToPARAM[focusedFeature]);
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
              featuresToPARAM={featuresToPARAM}
              features={features}
              focusedFeature={focusedFeature}
              setFocusedFeature={setFocusedFeature}
              setFatherToggle={setFatherToggle}
              />
              <div className={"main " + (fatherToggle?'toggled':'')}>
                {feature===featuresToPARAM[features[0]] && <ResumoGeral/>}
                {feature===featuresToPARAM[features[1]] && <Terceiros/>}
                {feature===featuresToPARAM[features[2]] && <Lojas/>}
                {feature===featuresToPARAM[features[3]] && <Bancos/>}
                {feature===featuresToPARAM[features[4]] && <Conciliacao/>}
              </div>
            </div>
          )}
        </div>
      );
}