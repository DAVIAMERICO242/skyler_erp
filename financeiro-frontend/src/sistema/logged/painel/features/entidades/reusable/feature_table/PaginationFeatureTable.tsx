/* eslint-disable @typescript-eslint/no-explicit-any */
//no momento suportado apenas para entidade CONTAS
import {FC, useEffect} from 'react';
import { useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import styled from 'styled-components';

const PaginationContainer = styled.div`
    margin-top:30px;
    width:100%;
`
  
export const PaginationFeatureTable = ({n_pages, refetch}:{n_pages:number, refetch:any})=>{
    const [current_page,setCurrent_page] = useState(1);
    const pages_indexes_starting_at_1 = Array.from({ length: n_pages }, (_, i) => i + 1);

    const manage_page_change = (page:number)=>{
        setCurrent_page(page)
    }

    const previous_page = ()=>{
        setCurrent_page((page)=>{
            if((page-1)>=1){
                return page - 1;
            }else{
                return page
            }
        })      
    }

    const next_page = ()=>{
        setCurrent_page((page)=>{
            if((page+1)<=n_pages){
                return page + 1;
            }else{
                return page
            }
        })
    }

    useEffect(()=>{
        console.log('useffect trigado mudança pagina')
        refetch(current_page);
    },[current_page])

    return(
        <PaginationContainer className="pagination_container">
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#"  onClick={()=>{previous_page()}}/>
                </PaginationItem>
                {pages_indexes_starting_at_1.map((e)=>{
                    return(
                     <PaginationItem>
                        <PaginationLink href="#" onClick={()=>{manage_page_change(e)}}>{e}</PaginationLink>
                      </PaginationItem>
                    )
                })}
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" onClick={()=>{next_page()}}/>
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        </PaginationContainer>
    )
}