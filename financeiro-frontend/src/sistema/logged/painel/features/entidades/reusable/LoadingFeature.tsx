import styled from "styled-components"
import favicon from '/SK_REMOS.png'
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

const StyledLoading = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    font-size:50px;
    height:70vh;
    margin-right:10%;
    >img{
        width:220px;
        height:200px;
        margin-bottom:50px;
        animation: fadeInOut 1.5s infinite; /* Duração da animação: 3 segundos, repetição infinita */
    }
`


export const LoadingFeature = ()=>{
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timeout = setTimeout(() => {
          if (progress === 100) {
            setProgress(13);
          } else {
            setProgress(100);
          }
        }, 2000);
    
        return () => clearTimeout(timeout); // Limpa o timeout quando o componente é desmontado
      }, [progress]);
    
    return (
        <StyledLoading>
            <img src={favicon}/>
            <Progress value={progress} className="w-[300px]" />
        </StyledLoading>
    )
}