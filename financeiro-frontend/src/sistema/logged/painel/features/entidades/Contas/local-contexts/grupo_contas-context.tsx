import { useContext, createContext, useState, useEffect } from "react";
import { getGrupoContas } from "../../BackendHelper/API/fetch";

const GrupoContasContext = createContext({})

export const GrupoContasProvider = ({children}:{children:React.ReactNode})=>{

    const [data,setData] = useState(undefined);

    function fetchGrupos(){
        console.log('aa')
        getGrupoContas().then((d)=>d.json()).then((d)=>setData(d?.data))
    }

    useEffect(()=>{
        fetchGrupos();
    },[])

    return(
        <GrupoContasContext.Provider value={{data,setData,fetchGrupos}}>
            {children}
        </GrupoContasContext.Provider>
    )
}

export const UseGrupoContas = ()=>{
    return useContext(GrupoContasContext);
}