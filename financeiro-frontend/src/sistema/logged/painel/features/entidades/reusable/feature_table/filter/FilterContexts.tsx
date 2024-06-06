/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

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

///aaaa
interface FilteredDataContextType {
    filteredData: { [key: number | string]: any }[];
    setFilteredData: Dispatch<SetStateAction<{ [key: number | string]: any }[]>>;
}

const filteredDataContext = createContext<FilteredDataContextType>({
    filteredData: [],
    setFilteredData: () => {}
});

export const FilteredDataProvider = ({ children }: { children: ReactNode }) => {
    const [filteredData, setFilteredData] = useState<{ [key: number | string]: any }[]>([]); // Abstração que ajuda a filtrar os dados

    return (
        <filteredDataContext.Provider value={{ filteredData, setFilteredData }}>
            {children}
        </filteredDataContext.Provider>
    );
};

export const useFilteredData = () => {
    return useContext(filteredDataContext);
};

