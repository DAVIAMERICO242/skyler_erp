/* eslint-disable no-var */
import { useEffect, useState } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import BACKEND_URL from '@/sistema/backend-urls';
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"   
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useTerceiros } from '../Terceiros/Terceiros';
import { useCategoriasFiscais } from './local-contexts/categorias_fiscais-context';
import { ContasData, useContas } from './local-contexts/contas-context';
import { CategoriasFiscaisData } from './local-contexts/categorias_fiscais-context';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
export const ContasForm = ({edit,setOpen}:{edit:boolean, setOpen?:any})=>{
  
  const terceirosData = useTerceiros().data;

  var categorias_fiscaisData = useCategoriasFiscais().data;
  const refetch_categorias_fiscais = useCategoriasFiscais().refetch;
  const contasData = useContas().data;//cache dos dados
  const refetchContas  = useContas().refetch;

  const [categoriasPura,setCategoriasPura] = useState<string[]>([]);
  const [categorias_fiscaisDataFiltered,setCategorias_fiscaisDataFiltered] = useState<CategoriasFiscaisData[]>([]);

  useEffect(()=>{
    if(categorias_fiscaisData){
        setCategoriasPura([...new Set(categorias_fiscaisDataFiltered.map((e)=>e.categoria_conta as string))]);
      }
  },[categorias_fiscaisDataFiltered]);



  const contasSchema = z.object({
    pastid: z.coerce.number().optional(),
    terceiro: z.string().min(2, {
      message: "O nome do terceiro deve ter no mínimo 2 caracteres",
    }),
    valor: z.coerce.number().positive({
        message: "O valor deve ser um número positivo",
      }),
    pagar_receber: z.string().min(5, {
        message: "Inválido",
      }),
    tipo_fiscal: z.string().min(2, {
        message: "Inválido",
      }),
    vencimento: z.date().refine((date) => date instanceof Date, {
        message: "A data de vencimento deve ser válida",
    })
  });

  
  const form = useForm<z.infer<typeof contasSchema>>({
    resolver: zodResolver(contasSchema)
  });

  const UXFiscal = (value:string)=>{
    console.log('UXFISCAL');
    console.log(value);
    form.setValue("tipo_fiscal","");
    if(categorias_fiscaisData){
        setCategorias_fiscaisDataFiltered(categorias_fiscaisData?.filter((e)=>e.pagar_receber===value));
    }
  }

  const { toast } = useToast();

  const [selectedPastId, setselectedPastId] = useState<ContasData>({});

  const findSelectedId = ()=>{
        if(!edit){
          return;
        }

        const current_conta_data:(ContasData | undefined) = contasData?.filter((e)=>e.id==form.getValues().pastid)[0]

        
        setselectedPastId(current_conta_data || {})
  }

  console.log('DADOS333')
  console.log(selectedPastId);

  const [loading,setLoading] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof contasSchema>) {
    console.log('eiei');
    console.log(values);
    setLoading(true);
    fetch(BACKEND_URL+`/contas/${!edit?"cadastro":"update"}`,{
      method:"POST",
      headers:{
        'Content-type':"application/json",
        'token':localStorage.getItem('token') as string,
      },
      body:JSON.stringify({conta:values})
    }).then((d)=>d.json())
      .then((d)=>{
        if(d.success){
          refetchContas();
          refetch_categorias_fiscais();
          toast({
            title: "Sucesso",
            className: "success",
            description: "Ocorreu tudo certo com a operação",
          })
          setLoading(false);
        }else{
          if(d.duplicate){
            console.log('duplicata')
            toast({
              title: "Duplicata",
              className: "error",
              description: "Esse nome já existe no banco de dados",
            })
          }
          else{
            toast({
              title: "Erro desconhecido",
              className: "error",
              description: "Comunique ao desenvolvedor",
            })
          }
          setLoading(false);
        }
      })
      .catch(()=>{
        toast({
          title: "Erro desconhecido",
          className: "error",
          description: "Comunique ao desenvolvedor",
        })
        setLoading(false);
      })
  }

  const novoTipoFiscal = ()=>{
     console.log('oi')
  }

  return(
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {edit && 
                  <FormField
                  control={form.control}
                  name="pastid"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>ID  a ser modificado (ver exportação)</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); findSelectedId(); }}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder="Escolher"/>
                            </SelectTrigger>
                            <SelectContent {...field }>
                                {contasData?.map((e)=>{
                                    return (
                                        <SelectItem value={e.id?.toString() as string}>{e.id?.toString()}</SelectItem>
                                    )
                                })}
                            </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                }
            <FormField
                  control={form.control}
                  name="terceiro"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>{"Nome do terceiro " + (edit ? "(novo)":"")}</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); findSelectedId(); }}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder={selectedPastId.terceiro?`Terceiro atual: ${selectedPastId.terceiro}`:"Escolher"}/>
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
                name="valor"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>{"Valor em R$ " + (edit ? "(novo)":"")}</FormLabel>
                    <FormControl>
                        <Input placeholder={selectedPastId.valor?.toString() as string || "Ex: 999.90"} {...field} />
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
                      <FormLabel>{"Pagar ou receber " + (edit ? "(novo)":"")}</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); findSelectedId(); UXFiscal(value)}}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder="Escolher"/>
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
            <div className="gambiarra" style={{ display: 'flex',alignItems:'center', gap:"10px", fontWeight:600 }}>
                <FormField
                    control={form.control}
                    name="tipo_fiscal"
                    render={({ field }) => (
                        <FormItem style={{ marginBottom: '30px' }}>
                        <FormLabel>{"Tipo fiscal " + (edit ? "(novo)":"")}</FormLabel>
                        <FormControl>
                            <Select onValueChange={(value) => { field.onChange(value); findSelectedId(); }}>
                                <SelectTrigger className="w-[100%] flex-1">
                                    <SelectValue placeholder="Escolher"/>
                                </SelectTrigger>
                                <SelectContent {...field }>


                                    {categoriasPura?.map((e)=>{
                                        return(
                                            <SelectGroup>
                                                <SelectLabel>{e}</SelectLabel>
                                                {categorias_fiscaisDataFiltered?.filter((e1)=>e1.categoria_conta===e).map((e2)=>{
                                                    return(
                                                        <SelectItem value={e2.nome_conta as string}>{e2.nome_conta}</SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
               <div onClick={novoTipoFiscal} style={{userSelect:"none",cursor:"pointer",height:"100%",fontSize:"13px",padding:'5px 10px' ,borderRadius: '3px', backgroundColor:'var(--deep-white)', color:"var(--skyler-blue)" }}>Novo</div>
            </div>
             <FormField
                control={form.control}
                name="vencimento"
                render={({ field }) => (
                    <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                    <FormLabel>{"Data de vencimento " + (edit ? "(novo)":"")}</FormLabel>
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
            <LoadingButton
                    loading={loading}
                    className="w-[100%]"
                    type="skyler">{!edit?"Cadastrar":"Confirmar edição"}
            </LoadingButton>
            </form>
        </Form>
      )
    
}