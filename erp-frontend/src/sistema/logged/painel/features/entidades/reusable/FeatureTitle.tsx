import styled from 'styled-components';

import { FaArrowRightArrowLeft } from "react-icons/fa6";


export const FeatureTitle = ({ children }:{children:string})=>{
    const StyledFeatureTitle = styled.div`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left:10px;
        gap:5px;
        color:rgb(107, 105, 105);
        font-size:20px;
    `;


    return (
        <StyledFeatureTitle>
            <FaArrowRightArrowLeft />
            {children}
        </StyledFeatureTitle>
    )
}