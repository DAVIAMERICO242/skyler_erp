/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, ReactNode, useState, SetStateAction, Dispatch, useContext } from 'react';

export interface SchemaContasFilterObject{
    situacao?:("parcial" | "resolvido" | null)[],
    pagar_receber?:string,
    terceiro?:string,
    nome_loja?:string,
    data?:string,
    competencia_inicio:string,
    competencia_fim:string,
    vencimento_inicio?:string,
    vencimento_fim?:string,
    data_resolucao?:string
}

interface ContasFilterContextType {
    filterContas: SchemaContasFilterObject | null,
    setFilterContas:  Dispatch<SetStateAction<SchemaContasFilterObject | null>>;
}

const FilterContasContext = createContext<ContasFilterContextType>({ filterContas: null, setFilterContas: () => {}});

export const FilterContasProvider = ({ children }:{children:ReactNode}) => {
    const [filterContas, setFilterContas] = useState<SchemaContasFilterObject|null>(null);
    return(
        <FilterContasContext.Provider value={{filterContas,setFilterContas}}>
            {children}
        </FilterContasContext.Provider>
    )
}

export const useFilterContas = () => {
    return useContext(FilterContasContext);
}
