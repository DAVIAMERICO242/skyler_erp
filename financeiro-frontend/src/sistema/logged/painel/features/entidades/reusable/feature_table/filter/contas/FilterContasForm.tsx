/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { useEffect, useState } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod';
import { SchemaContasFilterObject } from "../../../../Contas/local-contexts/contas-context";
import { useForm } from "react-hook-form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"   
  import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContas } from "../../../../Contas/local-contexts/contas-context";
import { useTerceiros } from "../../../../Terceiros/Terceiros";
import { useLojas } from "../../../../Lojas/Lojas";
import { useTableFilter } from "../FilterContextsNotContas";
import { usePagination } from "../../pagination/PaginationContext";
import { SchemaTerceirosData } from "../../../../Terceiros/Terceiros";
import { SchemaLojasData } from "../../../../Lojas/Lojas";
import { useFilterContas } from "./ContextFilterContas";
import {firstCharUpper } from "@/sistema/essentials";

export const FilterContasForm = ({setFilterContas,loading,form,terceirosData,lojasData,filterContasFormSchema}:
    {
    setFilterContas:any,
    loading:boolean,
    form:any,
    terceirosData:(SchemaTerceirosData[]|null),
    lojasData:(SchemaLojasData[]|null),
    filterContasFormSchema:any})=>{

    useEffect(()=>{
        return ()=>{
            console.log('desmontado form')
        }
    }
    ,[]);

    function onSubmit(values: z.infer<typeof filterContasFormSchema>){//o NÃO RESOLVIDO TEM QUE SER ALTERADO PRA NULO
        console.log('VAI SER REFATORADO');
        console.log(values);
        setFilterContas({...values,
            situacao:(values['situacao']==="Não Resolvido")?null:values['situacao'],
            data:(values['data']?.toISOString()),
            data_resolucao: (values['data_resolucao']?.toISOString()),
            vencimento_inicio: (values['vencimento_inicio']?.toISOString()),
            vencimento_fim: (values['vencimento_fim']?.toISOString()),
        })
    }

    return(//A logica dessa submissão esta em PaginationFeatureTable.tsx no useEffect filtrosObject
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
               <div className="w-1/2 flex gap-10 flex-col justify-center p-10">
                    <div className="flex flex-row gap-10">
                        <FormField
                            control={form.control}
                            name="situacao"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>{"Situação"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={
                                                firstCharUpper(form.getValues('situacao')) || "Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            <SelectItem value="resolvido">Resolvido</SelectItem>
                                            <SelectItem value="parcial">Parcial</SelectItem>
                                            <SelectItem value={"Não Resolvido"}>Não resolvido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pagar_receber"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>{"Pagar ou receber"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={firstCharUpper(form.getValues('pagar_receber')) || "Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            <SelectItem value="pagar">Pagar</SelectItem>
                                            <SelectItem value="receber">Receber</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="terceiro"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>{"Nome do terceiro"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={form.getValues('terceiro') || "Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            {terceirosData?.map((e)=>{
                                                return (
                                                    <SelectItem value={e.nome as string}>{e.nome}</SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nome_loja"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>{"Nome da loja"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={form.getValues('nome_loja') || "Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            {lojasData?.map((e)=>{
                                                return (
                                                    <SelectItem value={e.nome as string}>{e.nome}</SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
            
                    <div className="flex flex-row gap-10">
                        <FormField
                            control={form.control}
                            name="data"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Lançamento"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="data_resolucao"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Transação"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="flex flex-row gap-10">
                        <FormField
                            control={form.control}
                            name="vencimento_inicio"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Vencimento inicio"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vencimento_fim"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Vencimento fim"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild className="w-[100%]">
                                    <FormControl >
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <LoadingButton
                        loading={loading}
                        className="w-[100%] p-0"
                        type="skyler">{"Aplicar filtro"}
                    </LoadingButton>
               </div>
            </form>
         </Form>
    )
}