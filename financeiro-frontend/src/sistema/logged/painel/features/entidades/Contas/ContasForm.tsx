/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import { useEffect, useState } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
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
import { SchemaContasFrontendData, useContas } from './local-contexts/contas-context';
import { SchemaCategoriasFiscaisData } from './local-contexts/categorias_fiscais-context';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { NovoTipoFiscalDialog } from './NovoTipoFiscalDialog';
import { DialogTrigger } from "@/components/ui/dialog";
import { EditFieldAlert } from '../reusable/EditFieldAlert';
import { criarEditarContas } from '../BackendHelper/API/fetch';
import { areAllValuesUndefined, firstCharUpper } from '@/sistema/essentials';
import { usePagination } from '../reusable/feature_table/pagination/PaginationContext';
import { useCleanAllFilter, useTableFilter } from '../reusable/feature_table/filter/FilterContextsNotContasExceptClean';
import { areAllValuesEmptyArrays } from '@/sistema/essentials';
import { useFilterContas } from '../reusable/feature_table/filter/contas/ContextFilterContas';
import { useLojas } from '../Lojas/Lojas';
import { useBancos } from '../Bancos/Bancos';
import { UseGrupoContas } from './local-contexts/grupo_contas-context';
import { NovoGrupoContasDialog } from './NovoGrupoContasDialog';

export const ContasForm = ({edit,setOpen,identifier_value}:{edit:boolean, setOpen?:any, identifier_value?:string})=>{

  const cleanAll = useCleanAllFilter().cleanAll
  const setCleanAll = useCleanAllFilter().setCleanAll

  const filterContas = useFilterContas().filterContas;

  const contasData = useContas().data;

  const current_page = usePagination().current_page;

  const [signalUpdateUIAfterNewTipo,setSignalUpdateUIAfterNewTipo] = useState<number>(-1);
  const [storePagarReceberToUI,setStorePagarReceberToUI] = useState<"pagar" | "receber" | undefined>(undefined);
  
  const terceirosData = useTerceiros().data;
  const lojasData = useLojas().data;
  const bancosData = useBancos().data;
  const grupoContasData = UseGrupoContas().data;

  useEffect(()=>{
      console.log('BANCOS DATA INSIDE CONTAS')
    console.log(bancosData)
  },[bancosData])

  var categorias_fiscaisData = useCategoriasFiscais().data;
  var all_categorias = [...new Set(categorias_fiscaisData?.map((e)=>e.categoria_conta as string))]

  const refetch_categorias_fiscais = useCategoriasFiscais().refetch;
  const SchemaContasFrontendData = useContas().data;//cache dos dados
  const refetchContas  = useContas().refetch;

  const [categoriasPura,setCategoriasPura] = useState<string[]>([]);
  const [categorias_fiscaisDataFiltered,setCategorias_fiscaisDataFiltered] = useState<SchemaCategoriasFiscaisData[]>([]);

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
    loja: z.string().min(2, {
      message: "O nome da loja deve ter no mínimo 2 caracteres",
    }),
    nossa_conta_bancaria: z.string().min(2, {
      message: "O nome da conta deve ter no mínimo 2 caracteres",
    }),
    id_grupo: z.coerce.number(),
    valor: z.coerce.number().positive({
        message: "O valor deve ser um número positivo",
      }),
    pagar_receber: z.string().min(2, {
        message: "Inválido",
      }),
    tipo_fiscal: z.string().min(2, {
        message: "Inválido",
      }),
    vencimento: z.date().refine((date) => date instanceof Date, {
        message: "A data de vencimento deve ser válida",
    }),
    competencia: z.date().refine((date) => date instanceof Date, {
        message: "A data de competência deve ser válida",
  }),
    previsao: z.date().refine((date) => date instanceof Date, {
      message: "A data de previsão deve ser válida",
  }),
  });

  if(identifier_value){
    var form = useForm<z.infer<typeof contasSchema>>({
      resolver: zodResolver(contasSchema),
      defaultValues: {
        pastid: (parseInt(identifier_value) as number) || -1
      },
    });  
  }else{
    var form = useForm<z.infer<typeof contasSchema>>({
      resolver: zodResolver(contasSchema),
    });        
  }

  const UXFiscal = (value:"pagar" | "receber" | undefined)=>{
    console.log('UXFISCAL');
    console.log(value);
    if(categorias_fiscaisData){
        setCategorias_fiscaisDataFiltered(categorias_fiscaisData?.filter((e)=>e.pagar_receber===value));
        setStorePagarReceberToUI(value);
    }
  }

  useEffect(()=>{
    if(categorias_fiscaisData){
      setCategorias_fiscaisDataFiltered(categorias_fiscaisData?.filter((e)=>e.pagar_receber===storePagarReceberToUI))
    }
  },[signalUpdateUIAfterNewTipo, categorias_fiscaisData, storePagarReceberToUI])


  const { toast } = useToast();


  const [contaToBeEdited,setContaToBeEdited] = useState<SchemaContasFrontendData | undefined>([])

  useEffect(()=>{
    if(identifier_value){
      const current_conta_data:(SchemaContasFrontendData | undefined) = SchemaContasFrontendData?.filter((e)=>e.id==form.getValues().pastid)[0]
      if(current_conta_data){
        setContaToBeEdited(current_conta_data);
      }
    }
  },[identifier_value,terceirosData])

  useEffect(()=>{
    form.reset({
      terceiro:contaToBeEdited?.terceiro,
      valor:contaToBeEdited?.valor,
      loja: contaToBeEdited?.loja,
      id_grupo:contaToBeEdited?.id_grupo,
      nossa_conta_bancaria:contaToBeEdited?.nossa_conta_bancaria,
      pagar_receber:contaToBeEdited?.pagar_receber,
      tipo_fiscal:contaToBeEdited?.conta_tipo,
      previsao:contaToBeEdited?.previsao?(new Date(contaToBeEdited?.previsao)):"",
      vencimento:contaToBeEdited?.vencimento?(new Date(contaToBeEdited?.vencimento)):"",
      competencia:contaToBeEdited?.competencia?(new Date(contaToBeEdited?.competencia)):""
    });
    if(contaToBeEdited?.pagar_receber){
      UXFiscal(contaToBeEdited?.pagar_receber)
    }
  },[contaToBeEdited])

  console.log('DADOS333')

  const [loading,setLoading] = useState<boolean>(false);
  console.log('teste debuger')
  console.log('teste debuger2')

  function onSubmit(values: z.infer<typeof contasSchema>) {
    if(values.valor<contaToBeEdited?.valor_resolucao && edit){
       alert('O valor novo da conta não pode ser menor do que o valor da transação, se quiser atribuir um novo valor para conta, mude o valor da transação. Sugiro criar uma nova conta com essa diferença.');
       return;
    }



    console.log('CATEGORIAS FISCAIS DATA')
    console.log(categorias_fiscaisData);
    var validate_tipo = categorias_fiscaisData?.filter((e)=>e.pagar_receber===form.getValues("pagar_receber")).map((e)=>e.nome_conta)
    console.log('VALIDATE TIPO FISCAL');
    console.log(validate_tipo)
    if(!(validate_tipo?.includes(form.getValues("tipo_fiscal")))){
      alert('Tipo fiscal inválido para esse tipo de conta');
      return;
    }
    console.log('eiei');
    console.log(values);
    setLoading(true);
    criarEditarContas(edit,values).then((d)=>d.json())
      .then((d)=>{
        if(d.success){
          if(!edit){
            setCleanAll((prev)=>-1*prev);
          }
          if(contasData?.length===1){
            setCleanAll((prev)=>-1*prev);
          }
          setOpen(false);
          if(filterContas && !areAllValuesUndefined(filterContas)){
            refetchContas(current_page,filterContas);
          }else{  
            refetchContas(current_page);
          }
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
      .catch((error)=>{
        toast({
          title: "Erro desconhecido",
          className: "error",
          description: "Comunique ao desenvolvedor",
        })
        setLoading(false);
      })
  }

  const [rateioHistoricPagarReceberPlaceholder,setRateioHistoricPagarReceberPlaceholder] = useState("");
  const [rateioHistoricTipoFiscalPlaceholder,setRateioHistoricTipoFiscalPlaceholder] = useState("");
  const [rateioHistoricTerceiroPlaceholder, setRateioHistoricTerceiroPlaceholder] = useState("");

  const UXRateio = ()=>{
    const grupoHistoricoInfo = contasData?.filter((e)=>e.id_grupo===parseInt(form.getValues('id_grupo')));
    if(grupoHistoricoInfo?.length){
      form.setValue('pagar_receber', grupoHistoricoInfo[0]['pagar_receber']);
      form.setValue('tipo_fiscal', grupoHistoricoInfo[0]['conta_tipo']);
      form.setValue('vencimento', new Date(grupoHistoricoInfo[0]['vencimento']));
      form.setValue('competencia', new Date(grupoHistoricoInfo[0]['competencia']));
      form.setValue('previsao', new Date(grupoHistoricoInfo[0]['previsao']));
      form.setValue('terceiro', grupoHistoricoInfo[0]['terceiro']);
      setRateioHistoricPagarReceberPlaceholder(grupoHistoricoInfo[0]['pagar_receber'])
      setRateioHistoricTipoFiscalPlaceholder(grupoHistoricoInfo[0]['conta_tipo'])
      setRateioHistoricTerceiroPlaceholder(grupoHistoricoInfo[0]['terceiro'])
    }


  }



  return(
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-[100px]">
                <div>

                        {edit && 
                            <FormField
                            control={form.control}
                            name="pastid"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>ID da conta a ser mudada</FormLabel>
                                <FormControl>
                                    <Input {...field} defaultValue={identifier_value} disabled/>
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
                                  <FormLabel>{edit && <EditFieldAlert/>} {"Nome do terceiro"}</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[100%]">
                                            <SelectValue placeholder={rateioHistoricTerceiroPlaceholder || (contaToBeEdited?.terceiro || "Escolher")}/>
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
                              name="loja"
                              render={({ field }) => (
                                  <FormItem style={{ marginBottom: '30px' }}>
                                  <FormLabel>{edit && <EditFieldAlert/>} {"Loja"}</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[100%]">
                                            <SelectValue placeholder={(contaToBeEdited?.loja || "Escolher")}/>
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
                              control={form.control}
                              name="nossa_conta_bancaria"
                              render={({ field }) => (
                                  <FormItem style={{ marginBottom: '30px' }}>
                                  <FormLabel>{edit && <EditFieldAlert/>} {"Banco"}</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={(value) => { field.onChange(value); }}>
                                        <SelectTrigger className="w-[100%]">
                                            <SelectValue placeholder={contaToBeEdited?.nossa_conta_bancaria || "Escolher"}/>
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

                      <div className="gambiarra" style={{ display: 'flex',alignItems:'center', gap:"10px", fontWeight:600 }}>
                            <FormField
                                  control={form.control}
                                  name="id_grupo"
                                  render={({ field }) => (
                                      <FormItem style={{ marginBottom: '30px' }}>
                                      <FormLabel>{edit && <EditFieldAlert/>} {"Grupo rateio"}</FormLabel>
                                      <FormControl>
                                          <Select onValueChange={(value) => { field.onChange(value); UXRateio();}}>
                                            <SelectTrigger className="w-[100%]">
                                                <SelectValue placeholder={contaToBeEdited?.nome_grupo?`${contaToBeEdited?.nome_grupo} (cód: ${contaToBeEdited?.id_grupo})`:"Escolher"}/>
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
                            <NovoGrupoContasDialog/>
                        </div>

                        <FormField
                            control={form.control}  
                            name="valor"
                            render={({ field }) => (
                                <FormItem style={{ marginBottom: '30px' }}>
                                <FormLabel>{edit && <EditFieldAlert/>} {"Valor em R$"}</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Ex: 999.90"} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                      </div>

                    <div>
                        <FormField
                              control={form.control}
                              name="pagar_receber"
                              render={({ field }) => (
                                  <FormItem style={{ marginBottom: '30px' }}>
                                  <FormLabel>{edit && <EditFieldAlert/>} {"Pagar ou receber"}</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={(value) => { field.onChange(value); UXFiscal(value)}}>
                                        <SelectTrigger className="w-[100%]">
                                            <SelectValue placeholder={rateioHistoricPagarReceberPlaceholder || (contaToBeEdited?.pagar_receber || "Escolher")}/>
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
                                  <FormLabel>{edit && <EditFieldAlert/>} {"Tipo fiscal"}</FormLabel>
                                  <FormControl>
                                      <Select onValueChange={(value) => { field.onChange(value); }}>
                                          <SelectTrigger className="w-[100%] flex-1">
                                              <SelectValue placeholder={rateioHistoricTipoFiscalPlaceholder || (contaToBeEdited?.conta_tipo || "Escolher")}/>
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
                          <NovoTipoFiscalDialog categorias={all_categorias} setSignalUpdateUIAfterNewTipo={setSignalUpdateUIAfterNewTipo}/>
                      </div>
                      <FormField
                          control={form.control}
                          name="vencimento"
                          render={({ field }) => (
                              <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                              <FormLabel>{edit && <EditFieldAlert/>} {"Data de vencimento"}</FormLabel>
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
                                      defaultMonth={field.value}
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
                          name="competencia"
                          render={({ field }) => (
                              <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                              <FormLabel>{edit && <EditFieldAlert/>} {"Data de competência"}</FormLabel>
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
                                      defaultMonth={field.value}
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
                          name="previsao"
                          render={({ field }) => (
                              <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                              <FormLabel>{edit && <EditFieldAlert/>} {"Data de previsão"}</FormLabel>
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
                                      defaultMonth={field.value}
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

            </div>
            <LoadingButton
                    loading={loading}
                    className="w-[100%]"
                    type="skyler">{!edit?"Cadastrar":"Confirmar edição"}
            </LoadingButton>
            </form>
        </Form>
      )
    
}