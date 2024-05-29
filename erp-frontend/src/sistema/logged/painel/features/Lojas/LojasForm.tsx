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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLojas } from './Lojas';
import { LojasData } from './Lojas';

import { Input } from "@/components/ui/input"
export const LojasForm = ({edit,setOpen}:{edit:boolean, setOpen?:any})=>{
    const lojasData = useLojas().data;//cache dos dados
    const { refetch } = useLojas();

    console.log('lojas data')
    console.log(lojasData)

    const lojasSchema = z.object({
        pastnomeloja: z.string().min(2, {
          message: "O nome da loja deve ter 2 caracteres",
        }).optional(),
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
    
    const form = useForm<z.infer<typeof lojasSchema>>({
          resolver: zodResolver(lojasSchema),
          defaultValues: {
            nomeloja: "",
            cnpjloja: ""
          },
        });

    const { toast } = useToast();

    const [selectedPastLoja, setSelectedPastLoja] = useState<LojasData>({});

    const findSelectedLoja = ()=>{
          if(!edit){
            return;
          }

          const current_loja_data:(LojasData | undefined) = lojasData?.filter((e)=>e.nome===form.getValues().pastnomeloja)[0]

          
          setSelectedPastLoja(current_loja_data || {})
    }

    const [loading,setLoading] = useState<boolean>(false);
  
    function onSubmit(values: z.infer<typeof lojasSchema>) {
      console.log('form');
      console.log(values);
      setLoading(true);
      fetch(BACKEND_URL+`/lojas/${!edit?"cadastro":"update"}`,{
        method:"POST",
        headers:{
          'Content-type':"application/json",
          'token':localStorage.getItem('token') as string,
        },
        body:JSON.stringify({loja:values})
      }).then((d)=>d.json())
        .then((d)=>{
          if(d.success){
            refetch();
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
    }

    return(
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {edit && 
                  <FormField
                  control={form.control}
                  name="pastnomeloja"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>Nome da loja a ser mudada</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); findSelectedLoja(); }}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder="Escolher"/>
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
                }
                <FormField
                control={form.control}
                name="nomeloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Nome da loja</FormLabel>
                    <FormControl>
                        <Input placeholder={selectedPastLoja.nome || "nome loja"} {...field} />
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
                        <Input  placeholder={selectedPastLoja.razao || "razão social"} {...field} />
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
                        <Input placeholder={selectedPastLoja.cnpj || "CNPJ"} {...field} />
                    </FormControl>
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