/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import * as React from "react"
import { Eraser, Minus, Plus, X } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
 
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod';
import { FilterContasForm } from "./FilterContasForm";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTerceiros } from "../../../../Terceiros/Terceiros"
import { useLojas } from "../../../../Lojas/Lojas"
import { SchemaContasFilterObject, useFilterContas } from "./ContextFilterContas"
import { useContas } from "../../../../Contas/local-contexts/contas-context"
import { usePagination } from "../../pagination/PaginationContext"
import { areAllValuesUndefined } from "@/sistema/essentials"
import { useClickOutside } from '@mantine/hooks';
import { useRef } from "react"
import { useCleanAllFilter } from "../FilterContextsNotContasExceptClean"
import styled from "styled-components"
import { useBancos } from "../../../../Bancos/Bancos"


const LimparCampos = styled.div`
    color:white;
    background-color:var(--skyler-blue);
    border-radius:50px;
    padding:10px 20px;
    width:200px;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    margin-top:50px;
    gap:10px;
`

const CloseFilterDialog = styled.div`
   position:absolute;
   top:5%;
   right:5%;
   background-color:#d73d3d;
   color:white;
   width:70px;
   height:70px;
   border-radius:50%;
   cursor:pointer;
   display:flex;
   align-items:center;
   justify-content:center;
`

export const FilterContas = ({setLoadingPagination}:{setLoadingPagination:any})=>{
    //logica para limpar o estado do filtro atual se a requisição nao retornar nenhum dado ou falhar
    const [filterContasBeforeSubmit, setFilterContasBeforeSubmit] = useState<SchemaContasFilterObject>(null);

    const cleanSignal = useCleanAllFilter().cleanAll

    const terceirosData = useTerceiros().data;
    const lojasData = useLojas().data;
    const bancosData = useBancos().data;
    
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const {refetch} = useContas();

    const filterContas = useFilterContas().filterContas;
    const setFilterContas  = useFilterContas().setFilterContas;

    const current_page = usePagination().current_page;
    const setCurrent_page = usePagination().setCurrent_page;
    
    const filterContasFormSchema = z.object({
        situacao: z.any().optional(),//array de objetos
        pagar_receber: z.string().min(2, {
            message: "Nao precisa",
          }).optional(),
        terceiro: z.string().min(2, {
            message: "O nome do terceiro deve ter no mínimo 2 caracteres",
          }).optional(),
        loja: z.string().min(2, {
            message: "O nome da loja deve ter no mínimo 2 caracteres",
          }).optional(),
        nossa_conta_bancaria: z.string().min(2, {
            message: "O nome da conta deve ter no mínimo 2 caracteres",
          }).optional(),
        data: z.date().refine((date) => date instanceof Date, {
            message: "A data de vencimento deve ser válida",
        }).optional(),
        vencimento_inicio: z.date().refine((date) => date instanceof Date, {
            message: "A data de vencimento deve ser válida",
        }).optional(),
        vencimento_fim: z.date().refine((date) => date instanceof Date, {
            message: "A data de vencimento deve ser válida",
        }).optional(),
        competencia_inicio: z.date().refine((date) => date instanceof Date, {
            message: "A data de competencia deve ser válida",
        }).optional(),
        competencia_fim: z.date().refine((date) => date instanceof Date, {
            message: "A data de competencia deve ser válida",
        }).optional(),
        data_resolucao_inicio: z.date().refine((date) => date instanceof Date, {
            message: "A data de resolucao deve ser válida",
        }).optional(),
        data_resolucao_fim: z.date().refine((date) => date instanceof Date, {
            message: "A data de resolucao deve ser válida",
        }).optional(),
        previsao_inicio: z.date().refine((date) => date instanceof Date, {
            message: "A data de previsao deve ser válida",
        }).optional(),
        previsao_fim: z.date().refine((date) => date instanceof Date, {
            message: "A data de previsao deve ser válida",
        }).optional(),
      });

    var form = useForm<z.infer<typeof filterContasFormSchema>>({
        resolver: zodResolver(filterContasFormSchema),
      });

    useEffect(()=>{
        if(filterContas && !areAllValuesUndefined(filterContas)){
            console.log('FILTER CONTAS')
            console.log(filterContas);
            setLoading(true);
            setLoadingPagination(true);
            refetch(1,filterContas).then((d)=>{//parece ambiguo devido ao useEffect de PaginationFeatureTable, mas serve pra UI do usuário
                if(d?.data?.length){
                    setOpen(false);
                    setLoadingPagination(false);
                    setLoading(false);
                    setCurrent_page(1);
                }else{
                    setFilterContas(filterContasBeforeSubmit)
                    setLoadingPagination(false);
                    setLoading(false);
                    alert('Nenhum dado encontrado para esse filtro, tente novamente')
                }
            }).catch((err)=>{
                setFilterContas(filterContasBeforeSubmit)
                setLoadingPagination(false);
                setLoading(false);
                alert('Algum erro ocorreu')
            });
        }else{
            setLoadingPagination(true);
            refetch(1).then(()=>{
                setLoadingPagination(false);
            });
        }
    },[filterContas]);

    const drawerRef = React.useRef();

    useEffect(()=>{
        console.log('CLEAN SIGNAL TRIGADO')
        setCurrent_page(1);
        setFilterContas(null);
        form.reset();
    },[cleanSignal]);

    const limpar_campos = ()=>{
        form.reset();
        console.log('PAGAR RECEBER APOS LIMPEZA')
        console.log(form.getValues("pagar_receber"))
    }

    console.log('render')

    return(
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" onClick={()=>setOpen((prev)=>!prev)}>Filtrar essa tabela</Button>
            </DrawerTrigger>
            <DrawerContent ref={drawerRef} className="oiii" style={{overflow:"auto", height:"100%"}}>
                <DrawerHeader className="ml-7">
                    <DrawerTitle>Filtrar</DrawerTitle>
                    <DrawerDescription>Os filtros serão aplicados em todas as páginas.</DrawerDescription>
                    <LimparCampos onClick={limpar_campos}>
                        <Eraser />
                        Limpar campos
                    </LimparCampos>
                    <CloseFilterDialog onClick={()=>{setOpen(false)}}>
                        <X />
                    </CloseFilterDialog>
                </DrawerHeader>
                <FilterContasForm bancosData={bancosData} filterContas={filterContas} setFilterContasBeforeSubmit={setFilterContasBeforeSubmit} setFilterContas={setFilterContas} loading={loading} form={form} terceirosData={terceirosData} lojasData={lojasData} filterContasFormSchema={filterContasFormSchema}/>
            </DrawerContent>
        </Drawer>
    )
}


