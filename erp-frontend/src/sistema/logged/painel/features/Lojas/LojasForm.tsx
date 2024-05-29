import { LoadingButton } from '@/components/ui/LoadingButton';

import { useState } from 'react';

import BACKEND_URL from '@/sistema/backend-urls';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
export const LojasForm = ({edit}:{edit:boolean})=>{
    const lojasSchema = z.object({
        nomeloja: z.string().min(2, {
          message: "O nome da loja deve ter 2 caracteres",
        }),
        razaoloja: z.string().min(5, {
            message: "A razao social deve ter no mínimo 5 caracteres",
          }),
        cnpjloja: z.string().regex(/^\d{14}$/, {
          message: "A o cnpj deve conter 14 caracteres númericos",
        }),
      })
    
      const { toast } = useToast()
      const form = useForm<z.infer<typeof lojasSchema>>({
          resolver: zodResolver(lojasSchema),
          defaultValues: {
            nomeloja: "",
            cnpjloja: ""
          },
        });
        const [loading,setLoading] = useState<boolean>(false);
  
      function onSubmit(values: z.infer<typeof lojasSchema>) {
          setLoading(true);
          fetch(BACKEND_URL+'/lojas/cadastro',{
            method:"POST",
            headers:{
              'Content-type':"application/json",
              'token':localStorage.getItem('token') as string,
            },
            body:JSON.stringify({loja:values})
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
                    description: "Esse nome já existe no banco de dados",
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
                name="nomeloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Nome da loja</FormLabel>
                    <FormControl>
                        <Input  placeholder="nome loja" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="razaoloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Razão</FormLabel>
                    <FormControl>
                        <Input  placeholder="razão social" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="cnpjloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>CNPJ Loja (sem máscara)</FormLabel>
                    <FormControl>
                        <Input placeholder="CNPJ" {...field} />
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