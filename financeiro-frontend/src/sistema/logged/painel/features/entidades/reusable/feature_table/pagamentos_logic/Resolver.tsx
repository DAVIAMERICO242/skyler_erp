/* eslint-disable no-var */
import { LoadingButton } from "@/components/ui/LoadingButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import {z} from 'zod';
import { ResolverConta } from "../../../BackendHelper/API/fetch";
import { useContas } from "../../../Contas/local-contexts/contas-context";
import { usePagination } from "../pagination/PaginationContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Resolver = ({
    row,
    resolverOpen,
    setResolverOpen}:

    {row:any,
    resolverOpen:any,
    setResolverOpen:any})=>
{
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
        ResolverConta(row['id'],value.valor,row['valor']).then((d)=>d.json())//row['valor'] é o valor requerido
        .then((d)=>{
          if(d.success){

            refetch(current_page);

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
        console.log("VALOR DE RESOLUÇÃO");
        console.log(value)
        console.log('VALOR REQUISITADO');
        console.log(row['valor']);
        setResolverOpen(false);
    }

    console.log('ROW CLICADA');
    console.log(row);

    return(
        <Dialog open={resolverOpen} onOpenChange={setResolverOpen}>

            {!row['situacao'] &&                         
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="destructive">
                        {`Não resolvido`}
                    </LoadingButton>
                </DialogTrigger>
            }

            {row['situacao']==="parcial" &&             
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="warning">
                        {`Parcial`}
                    </LoadingButton>
                </DialogTrigger>
            }

            {row['situacao']==="resolvido" &&             
                <DialogTrigger asChild>
                    <LoadingButton loading={false} type="success">
                        {`Resolvido`}
                    </LoadingButton>
                </DialogTrigger>
            }

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Resolver conta</DialogTitle>
                <DialogDescription>
                </DialogDescription>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    )
}