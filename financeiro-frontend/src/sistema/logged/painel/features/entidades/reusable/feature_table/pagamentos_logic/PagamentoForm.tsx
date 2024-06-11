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

import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { useContas } from "../../../Contas/local-contexts/contas-context";
import { usePagination } from "../pagination/PaginationContext";
import {z} from 'zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResolverConta } from "../../../BackendHelper/API/fetch";
import { zodResolver } from "@hookform/resolvers/zod"

export const PagamentoForm = ({row, setResolverOpen}:{row:any, setResolverOpen:any})=>{
    
    const { toast } = useToast();

    const {refetch} = useContas();
    const current_page = usePagination().current_page
    const [loading,setLoading] = useState(false);

    const inputSchema = z.object({
        valor: z.coerce.number().max(row['valor'],
            {message:"O valor de resolução ultrapassa o valor exigido"}
        ),
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
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
        </Form>
        <LoadingButton
            loading={loading}
            className="w-[100%]"
            type="neutral">{"Confirmar"}
        </LoadingButton>
    </form>
    )
}


