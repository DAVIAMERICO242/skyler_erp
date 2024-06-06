/* eslint-disable no-var */
/* eslint-disable react-hooks/rules-of-hooks */
import { LoadingButton } from '@/components/ui/LoadingButton';

import { useEffect, useState } from 'react';

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
import { useBancos } from '../Bancos/Bancos';
import { LojasData } from './Lojas';

import { Input } from "@/components/ui/input"
import { EditFieldAlert } from '../reusable/EditFieldAlert';
export const LojasForm = ({edit,setOpen,identifier_value}:{edit:boolean, setOpen?:any, identifier_value?:string})=>{
    const lojasData = useLojas().data;//cache dos dados
    const refetchLojas = useLojas().refetch;
    const bancosData = useBancos().data
    const refetchBancos = useBancos().refetch

    console.log('lojas data')
    console.log(lojasData)

    const lojasSchema = z.object({
        pastnomeloja: z.string().min(2, {
          message: "O nome da loja deve ter 2 caracteres",
        }).optional(),

        contaloja: z.string().regex(/^\d{8}$/, {
          message: "A conta sem dígito deve ter 8 caracteres numéricos.",
        }),

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
    
    if(identifier_value){
      var form = useForm<z.infer<typeof lojasSchema>>({
        resolver: zodResolver(lojasSchema),
        defaultValues: {
          pastnomeloja:identifier_value || "",
          nomeloja: "",
          cnpjloja: ""
        },
      });
    }else{
      var form = useForm<z.infer<typeof lojasSchema>>({
        resolver: zodResolver(lojasSchema),
        defaultValues: {
          nomeloja: "",
          cnpjloja: ""
        },
      });      
    }
  

    const { toast } = useToast();

    const [selectedPastLoja, setSelectedPastLoja] = useState<LojasData>({});

    useEffect(()=>{
      if(identifier_value){
        const current_loja_data:(LojasData | undefined) = lojasData?.filter((e)=>e.nome===form.getValues().pastnomeloja)[0]
        setSelectedPastLoja(current_loja_data || {})
    }
    },[identifier_value,lojasData])



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
            refetchLojas();
            refetchBancos();
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
                          <Input {...field} defaultValue={identifier_value} disabled/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                }
                <FormField
                  control={form.control}
                  name="contaloja"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>{edit && <EditFieldAlert/>} Conta Bancária da loja (precisa estar registrado em bancos)</FormLabel>
                      <FormControl>
                          <Select onValueChange={(value) => { field.onChange(value); }}>
                            <SelectTrigger className="w-[100%]">
                                <SelectValue placeholder={selectedPastLoja.conta?`Conta atual: ${selectedPastLoja.conta}`:"Escolher"}/>
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
                <FormField
                control={form.control}
                name="nomeloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>{edit && <EditFieldAlert/>} Nome da loja</FormLabel>
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
                    <FormLabel>{edit && <EditFieldAlert/>} Razão</FormLabel>
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
                    <FormLabel>{edit && <EditFieldAlert/>} CNPJ Loja (sem máscara)</FormLabel>
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