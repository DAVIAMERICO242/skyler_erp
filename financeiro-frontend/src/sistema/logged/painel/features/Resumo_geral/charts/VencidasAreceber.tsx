import styled from "styled-components"

const VencidasAreceberContainer = styled.div`
    color:white;
    height:300px;
    border-radius:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    color:black;
    background-color:rgb(72, 234, 249);
    transition:all 0.2s ease;
    box-shadow: rgba(28, 149, 241, 0.25) 0px 50px 100px -20px, rgba(12, 85, 175, 0.3) 0px 30px 60px -30px;
    &:hover{
        cursor:pointer;
        transform: scale(1.2); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
    >h1{
        font-size:40px;
    }
    >h2{
        font-size:20px;
    }
    >div{
        font-size:14px;
    }
`

export const VencidasAreceber = ()=>{
    return(
        <VencidasAreceberContainer>
            <h2>Vencidas a receber não resolvidas e parciais</h2>
            <h1>R$ 6559.6</h1>
        </VencidasAreceberContainer>
    )
}