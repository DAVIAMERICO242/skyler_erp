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
import { Loader2 } from 'lucide-react';
import { useCleanAllFilter } from './filter/FilterContexts';

const PaginationContainer = styled.div`
    margin-top:30px;
    width:100%;
    opacity: ${(props)=>props.loadingPagination?0.5:1};
    pointer-events: ${(props)=>props.loadingPagination?'none':''};
`
  
export const PaginationFeatureTable = ({n_pages, refetch, loadingPagination,setLoadingPagination}:{n_pages:number, refetch:any, loadingPagination:boolean,setLoadingPagination:any})=>{
    const setCleanAll = useCleanAllFilter().setCleanAll
    const [current_page,setCurrent_page] = useState(1);//
    const [isActive, setIsActive] = useState(1);
    const [current_group, setGroup] = useState(1); //um grupo mostra 3 paginas pro usuário, cada grupo tem tamanho 2
    const group_size = 3;

    const pages_indexes_starting_at_1 = Array.from({ length: n_pages }, (_, i) => i + 1);

    const manage_page_change = (page:number)=>{//so mudanças numericas
        if(page!==current_page){
            setLoadingPagination(true);
            setCurrent_page(page);
        }
    }

    const previous_page = ()=>{
        setLoadingPagination(true)
        setCurrent_page((page)=>{
            if((page-1)>=1){
                if((page-1)<(current_group-1)*group_size + 1){
                    setGroup((prev)=>prev-1)
                }
                return page - 1;
            }else{
                setLoadingPagination(false);
                return page
            }
        })      
    }

    const next_page = ()=>{
        setLoadingPagination(true)
        setCurrent_page((page)=>{
            if((page+1)<=n_pages){
                if((page+1)>(current_group)*group_size){
                    setGroup((prev)=>prev+1)
                }
                return page + 1;
            }else{
                setLoadingPagination(false);
                return page
            }
        })
    }

    const previous_group = ()=>{
        setLoadingPagination(true);
        setGroup((prev)=>{
            setCurrent_page((prev-1)*group_size)
            return prev-1;
        })
    }

    const next_group = ()=>{
        setLoadingPagination(true);
        setGroup((prev)=>{
            setCurrent_page((prev)*group_size + 1)
            return prev+1;
        })
    }

    useEffect(()=>{
        console.log('useffect trigado mudança pagina')
        refetch(current_page)?.then(()=>{
            console.log('pagina carregada')
            setLoadingPagination(false);
            setCleanAll(prev=>-1*prev);
        })
        setIsActive(current_page)
    },[current_page])

    return(
        <PaginationContainer className="pagination_container" loadingPagination={loadingPagination}>
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#"  onClick={()=>{previous_page()}}/>
                </PaginationItem>
                {current_group>1 &&     
                    <PaginationItem>
                        <PaginationEllipsis onClick={()=>{previous_group()}}   style={{ cursor: 'pointer' }}/>
                    </PaginationItem>}
                {pages_indexes_starting_at_1.slice((current_group-1)*group_size,current_group*group_size).map((e)=>{
                    return(
                     <PaginationItem>
                        <PaginationLink isActive={isActive===e} href="#" onClick={()=>{manage_page_change(e)}}>{e}</PaginationLink>
                      </PaginationItem>
                    )
                })}

                {(n_pages > group_size && (current_group*group_size<n_pages)) && 
                    <PaginationItem>
                        <PaginationEllipsis onClick={()=>{next_group()}}   style={{ cursor: 'pointer' }}/>
                    </PaginationItem>
                }
                <PaginationItem>
                    <PaginationNext href="#" onClick={()=>{next_page()}}/>
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        </PaginationContainer>
    )
}