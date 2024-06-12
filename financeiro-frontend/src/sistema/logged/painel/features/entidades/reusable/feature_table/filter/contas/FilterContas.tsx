/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import * as React from "react"
import { Minus, Plus } from "lucide-react"
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

export const FilterContas = ({setLoadingPagination}:{setLoadingPagination:any})=>{
    const cleanSignal = useCleanAllFilter().cleanAll

    const terceirosData = useTerceiros().data;
    const lojasData = useLojas().data;
    
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const {refetch} = useContas();

    const filterContas = useFilterContas().filterContas;
    const setFilterContas  = useFilterContas().setFilterContas;

    const current_page = usePagination().current_page;
    const setCurrent_page = usePagination().setCurrent_page;
    
    const filterContasFormSchema = z.object({
        situacao: z.string().min(2, {
            message: "Nao precisa",
          }).optional(),
        pagar_receber: z.string().min(2, {
            message: "Nao precisa",
          }).optional(),
        terceiro: z.string().min(2, {
            message: "O nome do terceiro deve ter no mínimo 2 caracteres",
          }).optional(),
        nome_loja: z.string().min(2, {
            message: "O nome da loja deve ter no mínimo 2 caracteres",
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
        data_resolucao: z.date().refine((date) => date instanceof Date, {
            message: "A data de vencimento deve ser válida",
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
                    setLoadingPagination(false);
                    setLoading(false);
                    alert('Nenhum dado encontrado para esse filtro')
                }
            }).catch((err)=>{
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

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
        if (drawerRef.current && !drawerRef.current.contains(event.target) && (!(event.target.getAttribute("role") === "option") && !(event.target.tagName === "BUTTON") && !(event.target.tagName === "SVG") && !(event.target.id.includes("radix")))) {
            console.log(event.target)
            setOpen(false);
        }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [drawerRef]);
      

    return(
        <Drawer open={open} >
            <DrawerTrigger asChild>
                <Button variant="outline" onClick={()=>setOpen((prev)=>!prev)}>Filtrar essa tabela</Button>
            </DrawerTrigger>
            <DrawerContent ref={drawerRef}>
                <DrawerHeader className="ml-7">
                    <DrawerTitle>Filtrar</DrawerTitle>
                    <DrawerDescription>Os filtros serão aplicados em todas as páginas.</DrawerDescription>
                </DrawerHeader>
                <FilterContasForm setFilterContas={setFilterContas} loading={loading} form={form} terceirosData={terceirosData} lojasData={lojasData} filterContasFormSchema={filterContasFormSchema}/>
            </DrawerContent>
        </Drawer>
    )
}
