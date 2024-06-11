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
import { useState } from "react";
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

export const PagamentoForm = ({row, setResolverOpen}:{row:any, setResolverOpen:any})=>{
    
    const dataLojas = useLojas().data;

    const contas = [... new Set(dataLojas?.map((e)=>e.conta))]

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
        ),
        conta: z.string().regex(/^\d{8}$/, {
            message: "A conta sem dígito deve ter 8 caracteres numéricos.",
          })
        });
    var form = useForm<z.infer<typeof inputSchema>>({
            resolver: zodResolver(inputSchema),
        });
    
    function onSubmit(value: z.infer<typeof inputSchema>){
        setLoading(true);
        ResolverConta(row['id'],value.valor,row['valor']).then((d)=>d.json())//row['valor'] é o valor requerido
        .then((d)=>{
          if(d.success){
            setLoading(false);
            setResolverOpen(false);
            if(d.state==="parcial"){
                toast({
                    title: "PARCIAL",
                    className: "warning",
                    description: "Essa conta foi resolvida PARCIALMENTE",
                  })
            }
            if(d.state==="resolvido"){
                toast({
                    title: "RESOLVIDA",
                    className: "success",
                    description: "Essa conta foi resolvida COMPLETAMENTE",
                  })
            }

            if(!d.state){
                toast({
                    title: "DESRESOLVIDA",
                    className: "warning",
                    description: "Essa conta foi DESRESOLVIDA",
                  })
            }

            refetch(current_page);
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
                title: "GENERIC FOREIGN KEY ERROR",
                className: "error",
                description: "Esse erro provavelmente foi gerado porque você tentou excluir uma conta bancária relacionada a uma loja a um historico de contas",
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
                            <FormLabel>Data de pagamento</FormLabel>
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
                        <FormLabel>Valor de resolução (máximo: {row['valor']})</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Ex: 999.90"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                  <FormField
                  control={form.control}
                  name="conta"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>Conta Bancária da loja (precisa estar registrado em bancos)</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); }}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder={"Escolher"}/>
                            </SelectTrigger>
                            <SelectContent {...field }>
                                {contas?.map((e)=>{
                                    return (
                                        <SelectItem value={e as string}>{e}</SelectItem>
                                    )
                                })}
                            </SelectContent>
                          </Select>
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


