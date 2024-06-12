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
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTerceiros } from "../../../../Terceiros/Terceiros"
import { useLojas } from "../../../../Lojas/Lojas"

export const FilterContas = ()=>{
    const terceirosData = useTerceiros().data;
    const lojasData = useLojas().data;

    
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
        return ()=>{
            console.log('desmontado')
        }
    }
    ,[])

    return(
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Filtrar essa tabela</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="ml-7">
                    <DrawerTitle>Filtrar</DrawerTitle>
                    <DrawerDescription>Os filtros serão aplicados em todas as páginas.</DrawerDescription>
                </DrawerHeader>
                <FilterContasForm form={form} terceirosData={terceirosData} lojasData={lojasData} filterContasFormSchema={filterContasFormSchema}/>
            </DrawerContent>
        </Drawer>
    )
}
