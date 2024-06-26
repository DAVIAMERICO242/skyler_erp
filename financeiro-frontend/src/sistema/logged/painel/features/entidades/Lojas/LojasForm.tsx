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
import { SchemaLojasData } from './Lojas';

import { Input } from "@/components/ui/input"
import { EditFieldAlert } from '../reusable/EditFieldAlert';
import { criarEditarLojas } from '../BackendHelper/API/fetch';
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
            contaloja:"",
            razaoloja:"",
            cnpjloja: ""
          },
        });
      }
    else{
        var form = useForm<z.infer<typeof lojasSchema>>({
          resolver: zodResolver(lojasSchema),
          defaultValues: {
            nomeloja: "",
            contaloja:"",
            razaoloja:"",
            cnpjloja: ""
          },
        });      
      }
  
    const { toast } = useToast();

    const [lojaToBeEdited,setLojaToBeEdited] = useState<SchemaLojasData | undefined>([]);

    useEffect(()=>{
      if(identifier_value){
        const current_loja_data:(SchemaLojasData | undefined) = lojasData?.filter((e)=>e.nome===form.getValues().pastnomeloja)[0]
        if(current_loja_data){
          setLojaToBeEdited(current_loja_data);
        }
    }
    },[identifier_value,lojasData]);

    useEffect(()=>{
      form.reset({
        nomeloja: lojaToBeEdited?.nome,
        contaloja: lojaToBeEdited?.conta,
        razaoloja: lojaToBeEdited?.razao,
        cnpjloja: lojaToBeEdited?.cnpj,
      });
    },[lojaToBeEdited]);


    const [loading,setLoading] = useState<boolean>(false);
  
    function onSubmit(values: z.infer<typeof lojasSchema>) {
      console.log('form');
      console.log(values);
      setLoading(true);
      criarEditarLojas(edit,values).then((d)=>d.json())
        .then((d)=>{
          if(d.success){
            setOpen(false);
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
                description: "Esse nome já existe no banco de dados, OBS: uma loja só pode ter uma conta bancária e o nome da loja é unico",
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
        .catch((err)=>{
          console.log(err);
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
                name="nomeloja"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>{edit && <EditFieldAlert/>} Nome da loja</FormLabel>
                    <FormControl>
                        <Input placeholder={"nome loja"} {...field}/>
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
                        <Input  placeholder={"razão social"} {...field} />
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
                        <Input placeholder={"CNPJ"} {...field} />
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