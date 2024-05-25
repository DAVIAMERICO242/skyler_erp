import { useState,useEffect} from "react";
import { checkAuth } from "../auth/checkAuth";
import { LoadingAuth } from "../auth/LoadingAuth";
import { useNavigate } from 'react-router-dom';

export const Painel = ()=>{
    const navigateTo = useNavigate();
    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        checkAuth()
        .then(()=>{setIsLoading(false)})
        .catch(()=>{setIsLoading(false);navigateTo('/login')})
    },[])

    return (
        <div>
          {isLoading ? (
            <LoadingAuth />
          ) : (
            <div>Bem-vindo ao painel</div>
          )}
        </div>
      );
}