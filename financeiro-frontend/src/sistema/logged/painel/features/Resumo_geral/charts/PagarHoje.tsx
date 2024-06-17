import styled from "styled-components"

const PagarHojeContainer = styled.div`
    color:white;
    border-radius:5px;
    height:300px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:rgb(239, 85, 85);
    box-shadow: rgba(235, 64, 38, 0.25) 0px 50px 100px -20px, rgba(227, 56, 26, 0.3) 0px 30px 60px -30px;
    transition:all 0.2s ease;
    &:hover{
        cursor:pointer;
        transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
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

export const PagarHoje = ()=>{
    return(
        <PagarHojeContainer>
            <h2>A pagar hoje</h2>
            <h1>R$ 6559.6</h1>
        </PagarHojeContainer>
    )
}
