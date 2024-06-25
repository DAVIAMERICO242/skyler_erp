/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */

import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { useContas } from "../../../Contas/local-contexts/contas-context";
import { usePagination } from "../pagination/PaginationContext";
import {z} from 'zod';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ResolverConta } from "../../../BackendHelper/API/fetch";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"   
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLojas } from "../../../Lojas/Lojas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areAllValuesUndefined } from "@/sistema/essentials";
import { useFilterContas } from "../filter/contas/ContextFilterContas";
import { useCleanAllFilter } from "../filter/FilterContextsNotContasExceptClean";

export const PagamentoForm = ({row, setResolverOpen}:{row:any, setResolverOpen:any})=>{

    const setCleanAll = useCleanAllFilter().setCleanAll

    const contasData = useContas().data;

    const filterContas = useFilterContas().filterContas;

    const dataLojas = useLojas().data;

    const contas = [... new Set(dataLojas?.map((e)=>e.conta))];

    const contasDataForThisId = useContas().data?.filter((e)=>e.id===row['id'])[0];

    console.log('CONTAS DATA FOR THIS ID');
    console.log(contasDataForThisId)

    const { toast } = useToast();
    const {refetch} = useContas();
    const current_page = usePagination().current_page
    const [loading,setLoading] = useState(false);

    const inputSchema = z.object({
        data_resolucao: z.date().refine((date) => date instanceof Date, {
            message: "A data de vencimento deve ser válida",
        }),
        valor: z.coerce.number().max(row['valor'],
            {message:"O valor de resolução ultrapassa o valor exigido"}
        )
        });
    var form = useForm<z.infer<typeof inputSchema>>({
            resolver: zodResolver(inputSchema),
        });

    useEffect(()=>{
      if(contasDataForThisId){
        form.reset({
          data_resolucao: contasDataForThisId?.data_resolucao?(new Date(contasDataForThisId?.data_resolucao)):"",
          valor: contasDataForThisId?.valor_resolucao,
          contaloja: contasDataForThisId?.nossa_conta_bancaria,
        });
      }
    },[contasDataForThisId])
    
    function onSubmit(value: z.infer<typeof inputSchema>){
        setLoading(true);
        ResolverConta(row['id'],value.valor,row['valor'],value.data_resolucao,value.contaloja).then((d)=>d.json())//row['valor'] é o valor requerido
        .then((d)=>{
          if(d.success){
            if(contasData?.length===1){//se a conta ta filtrada e eu fiz uma operação que nao obedece o filtro, e essa conta é a ultima da pagina eu tenho que limpar o filtro
              setCleanAll((prev)=>-1*prev);
            }
            setLoading(false);
            setResolverOpen(false);
            if(d.state==="parcial"){
                toast({
                    title: "PARCIAL",
                    className: "warning",
                    description: "Essa conta foi resolvida PARCIALMENTE, CASO NÃO APAREÇA A MUDANÇA RECARREGUE A PÁGINA",
                  })
            }
            if(d.state==="resolvido"){
                toast({
                    title: "RESOLVIDA",
                    className: "success",
                    description: "Essa conta foi resolvida COMPLETAMENTE, CASO NÃO APAREÇA A MUDANÇA RECARREGUE A PÁGINA",
                  })
            }

            if(!d.state){
                toast({
                    title: "DESRESOLVIDA",
                    className: "warning",
                    description: "Essa conta foi DESRESOLVIDA, CASO NÃO APAREÇA A MUDANÇA RECARREGUE A PÁGINA",
                  })
            }
            if(filterContas && !areAllValuesUndefined(filterContas)){
              refetch(current_page,filterContas);
            }else{
              refetch(current_page);
            }
          }else{
            setLoading(false);
            setResolverOpen(false);
            if(d.duplicate){
              console.log('duplicata')
              toast({
                title: "Duplicata",
                className: "error",
                description: "Esse nome ou conta bancária já existe no banco de dados",
              })
            }else if(d.foreign_key){
              toast({
                title: "NÃO AUTORIZADO",
                className: "error",
                description: "Você não pode excluir um terceiro/loja/banco que esteja em contas a pagar ou receber",
              })
            }
            else{
              toast({
                title: "Erro desconhecido",
                className: "error",
                description: "Comunique ao desenvolvedor",
              })
            }
          }
        })
        .catch(()=>{
          toast({
            title: "Erro desconhecido",
            className: "error",
            description: "Comunique ao desenvolvedor",
          })
          setLoading(false);
          setResolverOpen(false);
        })
        console.log("VALOR DE RESOLUÇÃO");
        console.log(value)
        console.log('VALOR REQUISITADO');
        console.log(row['valor']);
    }

    console.log('ROW CLICADA');
    console.log(row);

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="data_resolucao"
                        render={({ field }) => (
                            <FormItem className="data-100 flex flex-col w-full" style={{ marginBottom: '30px'}}>
                            <FormLabel>Data REAL do pagamento</FormLabel>
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
                    name="valor"
                    render={({ field }) => (
                        <FormItem style={{ marginBottom: '30px' }}>
                        <FormLabel>Valor de transação/resolução (máximo: {row['valor']})</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Ex: 999.90"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <LoadingButton
                    loading={loading}
                    className="w-[100%]"
                    type="neutral">{"Confirmar"}
                </LoadingButton>
            </form>
        </Form>
    )
}


