import { useState } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import BACKEND_URL from '@/sistema/backend-urls';
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const BancosForm = ({edit}:{edit:boolean})=>{
    const { toast } = useToast()

    const bancosSchema = z.object({
        banco: z.string().regex(/^\d{3}$/, {
          message: "O banco deve ter 3 caracteres numéricos.",
        }),
        agencia: z.string().regex(/^\d{4}$/, {
          message: "A agência deve ter 4 caracteres numéricos.",
        }),
        conta: z.string().regex(/^\d{8}$/, {
            message: "A conta sem dígito deve ter 8 caracteres numéricos.",
          }),
      });

    const form = useForm<z.infer<typeof bancosSchema>>({
        resolver: zodResolver(bancosSchema),
        defaultValues: {
          banco: "",
          agencia:"",
          conta: ""
        },
      });

    const [loading,setLoading] = useState<boolean>(false);

    function onSubmit(values: z.infer<typeof bancosSchema>) {
        setLoading(true);
        fetch(BACKEND_URL+'/bancos/cadastro',{
          method:"POST",
          headers:{
            'Content-type':"application/json",
            'token':localStorage.getItem('token') as string,
          },
          body:JSON.stringify({banco:values})
        }).then((d)=>d.json())
          .then((d)=>{
            if(d.success){
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
                  description: "Essa conta bancária já existe no banco de dados",
                })
              }else{
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
        console.log(values)
      }

      return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name="banco"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Banco</FormLabel>
                    <FormControl>
                        <Input placeholder="Número do banco (xxx)" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="agencia"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Agência (sem digito)</FormLabel>
                    <FormControl>
                        <Input placeholder="AAAA" {...field} />
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
                    <FormLabel>Conta (sem digito)</FormLabel>
                    <FormControl>
                        <Input placeholder="xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <LoadingButton
                    loading={loading}
                    className="w-[100%]"
                    type="skyler">Cadastrar
            </LoadingButton>
            </form>
        </Form>
      )
    
}