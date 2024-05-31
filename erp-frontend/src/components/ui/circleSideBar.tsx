import { ReactNode } from 'react';
import styled from 'styled-components';
import {FC} from 'react';

const Circle = styled.div<{ focused: boolean }>`
    transition: all 0.1s ease;
    position: relative;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({focused}) => (!focused?"var(--skyler-blue)":'var(--deep-white)')};
    background-color: ${({focused}) => (focused?"var(--skyler-blue)":'var(--deep-white)')};
    width: 35px;
    height: 35px;
    border-radius: 50%;    
    box-shadow: ${({ focused }) => (focused ? '0 0 0 2px var(--focus-color)' : 'none')};
`;

interface CircleSideType extends React.HTMLAttributes<HTMLDivElement>{
    children?:ReactNode,
    focused:boolean
}

export const CircleSideBar:FC<CircleSideType> =  ({children,focused})=>{
    return(
        <Circle focused={focused}>
            {children}
        </Circle>
    )
}