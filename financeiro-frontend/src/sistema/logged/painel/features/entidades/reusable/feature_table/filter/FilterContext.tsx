/* eslint-disable @typescript-eslint/no-explicit-any */
import {Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

interface FilterContextType {
    filteredData: { [key: number | string]: any[] };
    setFilteredData: Dispatch<SetStateAction<{[key: number | string]:any[]}>>;
}

const filterContext = createContext<FilterContextType>({
    filteredData: {},
    setFilteredData: () => {}
});

export const TableFilterProvider = ({ children }:{children:ReactNode})=>{

    const [filteredData,setFilteredData] = useState<{[key: number | string]:any[]}>({});

    return(
        <filterContext.Provider value={{filteredData,setFilteredData}}>
            {children}
        </filterContext.Provider>
    )

}

export const useTableFilter = ()=>{
    return useContext(filterContext);
}
