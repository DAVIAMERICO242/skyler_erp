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
    
    return (
        <StyledLoading>
            <img src={favicon}/>
        </StyledLoading>
    )
}