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
 
import { FilterContasForm } from "./FilterContasForm";

export const FilterContas = ()=>{
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
                <FilterContasForm/>
            </DrawerContent>
        </Drawer>
    )
}
