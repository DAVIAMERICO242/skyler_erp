import styled from "styled-components";

export const DaviToolTip = ({children})=>{
    const ToolTipContainer = styled.div`
        cursor: pointer;
        background-color:#252525;
        position:absolute;
        padding:5px 10px;
        color:white;
        border-radius:3px;
        font-weight:100;
        left:50%;
        opacity:0;
        &:hover {
            opacity: 1;
        }
    `
    return(
        <ToolTipContainer>
            {children}
        </ToolTipContainer>
    )
}


