/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

///contexto abstrato que ajuda na logica do filtro
interface PaginationContextType {
    current_page:number;
    setCurrent_page: Dispatch<SetStateAction<number>>;
}

const PaginationContext = createContext<PaginationContextType>({
    current_page: 1,
    setCurrent_page: () => {}
});


export const usePagination = ()=>{
    return useContext(PaginationContext);
}

export const PaginationProvider = ({ children }:{children:ReactNode})=>{

    const [current_page, setCurrent_page] = useState<number>(1);//abstração que ajuda a filtrar os dados

    return(
        <PaginationContext.Provider value={{current_page,setCurrent_page}}>
            {children}
        </PaginationContext.Provider>
    )

}