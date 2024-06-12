/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

///contexto abstrato que ajuda na logica do filtro
interface FilterContextType {
    dataFilter: { [key: number | string]: any[] };
    setdataFilter: Dispatch<SetStateAction<{[key: number | string]:any[]}>>;
}

const filterContext = createContext<FilterContextType>({
    dataFilter: {},
    setdataFilter: () => {}
});

export const TableFilterProvider = ({ children }:{children:ReactNode})=>{

    const [dataFilter,setdataFilter] = useState<{[key: number | string]:any[]}>({});//abstração que ajuda a filtrar os dados

    return(
        <filterContext.Provider value={{dataFilter,setdataFilter}}>
            {children}
        </filterContext.Provider>
    )

}

export const useTableFilter = ()=>{
    return useContext(filterContext);
}

///contexto que abriga os dados filtrados
interface FilteredDataContextType {
    FilteredDataNotContas: { [key: number | string]: any }[];
    setFilteredData: Dispatch<SetStateAction<{ [key: number | string]: any }[]>>;
}

const filteredDataContext = createContext<FilteredDataContextType>({
    FilteredDataNotContas: [],
    setFilteredData: () => {}
});

export const FilteredDataNotContasProvider = ({ children }: { children: ReactNode }) => {
    const [FilteredDataNotContas, setFilteredData] = useState<{ [key: number | string]: any }[]>([]); // Abstração que ajuda a filtrar os dados

    return (
        <filteredDataContext.Provider value={{ FilteredDataNotContas, setFilteredData }}>
            {children}
        </filteredDataContext.Provider>
    );
};

export const useFilteredData = () => {
    return useContext(filteredDataContext);
};

//context que referencia a limpeza de filtro

interface CleanAllFilterContextType {
    cleanAll:number
    setCleanAll: Dispatch<SetStateAction<number>>;
}

const CleanAllFilterContext = createContext<CleanAllFilterContextType>({
    cleanAll:-1,
    setCleanAll: () => {}
});

export const CleanAllFilterProvider = ({ children }: { children: ReactNode })=>{
    const [cleanAll, setCleanAll] = useState(-1);
    return (
        <CleanAllFilterContext.Provider value={{ cleanAll, setCleanAll }}>
            {children}
        </CleanAllFilterContext.Provider>
    );
}

export const useCleanAllFilter = () => {//INCLUI CONTAS
    return useContext(CleanAllFilterContext);
};