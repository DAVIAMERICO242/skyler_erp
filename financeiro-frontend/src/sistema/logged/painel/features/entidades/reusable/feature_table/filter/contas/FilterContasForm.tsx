/* eslint-disable no-var */
import { useContas } from "../../../../Contas/local-contexts/contas-context";
import { useTerceiros } from "../../../../Terceiros/Terceiros";
import { useLojas } from "../../../../Lojas/Lojas";
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

export const FilterContasForm = ()=>{

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
    
    function onSubmit(values: z.infer<typeof filterContasFormSchema>){
        console.log('FILTRO CONTAS');
        console.log(values)
        console.log('a');
    }

    return(
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
                                            <SelectValue placeholder={"Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            <SelectItem value="resolvido">Resolvido</SelectItem>
                                            <SelectItem value="parcial">Parcial</SelectItem>
                                            <SelectItem value={null}>Não resolvido</SelectItem>
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
                                            <SelectValue placeholder={"Escolher"}/>
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
                                            <SelectValue placeholder={"Escolher"}/>
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
                                            <SelectValue placeholder={"Escolher"}/>
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
                        loading={false}
                        className="w-[100%] p-0"
                        type="skyler">{"Aplicar filtro"}
                    </LoadingButton>
               </div>
            </form>
         </Form>
    )
}