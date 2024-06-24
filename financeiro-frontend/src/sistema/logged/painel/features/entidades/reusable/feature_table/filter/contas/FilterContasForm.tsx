/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
import { useEffect, useState } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import {z} from 'zod';
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
import { SchemaTerceirosData } from "../../../../Terceiros/Terceiros";
import { SchemaLojasData } from "../../../../Lojas/Lojas";
import {firstCharUpper } from "@/sistema/essentials";
import MultipleSelector from "@/components/ui/MultipleSelector";
import { SchemaBancosData } from "../../../../Bancos/Bancos";


export const FilterContasForm = ({grupoContasData,setFilterContasBeforeSubmit,filterContas,setFilterContas,loading,form,terceirosData,lojasData,bancosData,filterContasFormSchema}:
    {
    grupoContasData:any,
    setFilterContasBeforeSubmit:any,
    filterContas:any,
    setFilterContas:any,
    loading:boolean,
    form:any,
    terceirosData:(SchemaTerceirosData[]|null),
    lojasData:(SchemaLojasData[]|null),
    bancosData:(SchemaBancosData[]|null),
    filterContasFormSchema:any})=>{

    useEffect(()=>{
        return ()=>{
            console.log('desmontado form')
        }
    }
    ,[]);

    console.log('renderizado novs')

    function onSubmit(values: z.infer<typeof filterContasFormSchema>){//o NÃO RESOLVIDO TEM QUE SER ALTERADO PRA NULO
        console.log('VAI SER REFATORADO');
        console.log(values);
        
        setFilterContasBeforeSubmit(filterContas);
        setFilterContas({...values,
            situacao:values['situacao']?.map((e)=>{
                if(e.value==="não resolvido"){
                    return null
                }else{
                    return e.value
                }
            }),
            data:(values['data']?.toISOString()),
            vencimento_inicio: (values['vencimento_inicio']?.toISOString()),
            vencimento_fim: (values['vencimento_fim']?.toISOString()),
            competencia_inicio: (values['competencia_inicio']?.toISOString()),
            competencia_fim: (values['competencia_fim']?.toISOString()),
            previsao_inicio: (values['previsao_inicio']?.toISOString()),
            previsao_fim: (values['previsao_fim']?.toISOString()),
            data_resolucao_inicio: (values['data_resolucao_inicio']?.toISOString()),
            data_resolucao_fim: (values['data_resolucao_fim']?.toISOString()),
        })
    }

    useEffect(()=>{
        console.log('FILTRO ESTADO');
        console.log(filterContas)

    },[filterContas])

    const pagar_receber_debug = firstCharUpper(form.getValues("pagar_receber"));

    return(//A logica dessa submissão esta em PaginationFeatureTable.tsx no useEffect filtrosObject
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
               <div className="w-1/2 flex gap-10 flex-col justify-center p-10">
                    <FormField
                                  key={form.getValues('id_grupo')}
                                  control={form.control}
                                  name="id_grupo"
                                  render={({ field }) => (
                                      <FormItem style={{ marginBottom: '30px' }}>
                                      <FormLabel>{"Grupo rateio"}</FormLabel>
                                      <FormControl>
                                          <Select onValueChange={(value) => { field.onChange(value); }}>
                                            <SelectTrigger className="w-[30%]">
                                                <SelectValue placeholder={"Escolher"}/>
                                            </SelectTrigger>
                                            <SelectContent {...field }>
                                                {grupoContasData?.map((e)=>{
                                                    return (
                                                        <SelectItem value={e.id_grupo?.toString()}> {e.nome_grupo} <i>(cód: {e.id_grupo})</i> </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                          </Select>
                                      </FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                        />
                    <div className="flex flex-row gap-10">
                    <FormField
                            key={form.getValues('situacao')}
                            control={form.control}
                            name="situacao"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Situação</FormLabel>
                                <FormControl>
                                    <MultipleSelector
                                    options={[{ label: 'Resolvido', value: 'resolvido' },{label:"Parcial", value:"parcial"},{label:"Não Resolvido", value:"não resolvido"}]}
                                    {...field}
                                    placeholder="Selecione..."
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            key={form.getValues('pagar_receber')}
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
                            key={form.getValues('terceiro')}
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
                            key={form.getValues('loja')}
                            control={form.control}
                            name="loja"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel style={{textWrap:"nowrap"}}>{"Nome da loja associada"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={form.getValues('loja') || "Escolher"}/>
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
                        <FormField
                            key={form.getValues('nossa_conta_bancaria')}
                            control={form.control}
                            name="nossa_conta_bancaria"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel style={{textWrap:"nowrap"}}>{"Conta bancária associada"}</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={form.getValues('nossa_conta_bancaria') || "Escolher"}/>
                                        </SelectTrigger>
                                        <SelectContent {...field }>
                                            {bancosData?.map((e)=>{
                                                return (
                                                    <SelectItem value={e.conta as string}>{e.conta}</SelectItem>
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
                            key={form.getValues('data')}
                            control={form.control}
                            name="data"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Data de lançamento"}</FormLabel>
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
                            key={form.getValues('previsao_inicio')}
                            control={form.control}
                            name="previsao_inicio"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Previsão de pagamento início"}</FormLabel>
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
                            key={form.getValues('previsao_fim')}
                            control={form.control}
                            name="previsao_fim"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Previsão de pagamento fim"}</FormLabel>
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
                            key={form.getValues('data_resolucao_inicio')}
                            control={form.control}
                            name="data_resolucao_inicio"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Data de transação início"}</FormLabel>
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
                            key={form.getValues('data_resolucao_fim')}
                            control={form.control}
                            name="data_resolucao_fim"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Data de transação fim"}</FormLabel>
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
                            key={form.getValues('vencimento_inicio')}
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
                            key={form.getValues('vencimento_fim')}
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
                    <div className="flex flex-row gap-10">
                        <FormField
                            control={form.control}
                            key={form.getValues('competencia_inicio')}
                            name="competencia_inicio"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Competência inicio"}</FormLabel>
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
                            key={form.getValues('competencia_fim')}
                            name="competencia_fim"
                            render={({ field }) => (
                                <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                                <FormLabel>{"Competência fim"}</FormLabel>
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