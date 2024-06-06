/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
import { useEffect, useState } from 'react';
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
import { BancosData, useBancos } from './Bancos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const BancosForm = ({edit,setOpen,identifier_value}:{edit:boolean, setOpen?:any, identifier_value?:string})=>{
  const bancosData = useBancos().data;//cache dos dados
  const { refetch } = useBancos();

  console.log('bancos data')
  console.log(bancosData)

  const bancosSchema = z.object({
    nomebanco: z.string().min(2, {
      message: "O nome do banco deve ter no mínimo 2 caracteres",
    }),
    banco: z.string().regex(/^\d{3}$/, {
      message: "O banco deve ter 3 caracteres numéricos.",
    }),
    agencia: z.string().regex(/^\d{4}$/, {
      message: "A agência deve ter 4 caracteres numéricos.",
    }),
    conta: z.string().regex(/^\d{8}$/, {
        message: "A conta sem dígito deve ter 8 caracteres numéricos.",
      }),
    pastconta: z.string().regex(/^\d{8}$/, {
      message: "A conta sem dígito deve ter 8 caracteres numéricos.",
    }).optional(),

    saldoinicial: z.coerce.number(),
  });


  if(identifier_value){
    var form = useForm<z.infer<typeof bancosSchema>>({
      resolver: zodResolver(bancosSchema),
      defaultValues: {
        pastconta:identifier_value || "",
        agencia:"",
        conta: ""
      },
    });  
  }else{
    var form = useForm<z.infer<typeof bancosSchema>>({
      resolver: zodResolver(bancosSchema),
      defaultValues: {
        banco: "",
        agencia:"",
        conta: ""
      },
    });        
  }
  
  const { toast } = useToast();

  const [selectedPastBanco, setSelectedPastBanco] = useState<BancosData>({});

  useEffect(()=>{
    if(identifier_value){
      const current_banco_data:(BancosData | undefined) = bancosData?.filter((e)=>e.conta===form.getValues().pastconta)[0]
      setSelectedPastBanco(current_banco_data || {})
    }
  },[identifier_value,bancosData])

  const [loading,setLoading] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof bancosSchema>) {
    console.log('form');
    console.log(values);
    setLoading(true);
    fetch(BACKEND_URL+`/bancos/${!edit?"cadastro":"update"}`,{
      method:"POST",
      headers:{
        'Content-type':"application/json",
        'token':localStorage.getItem('token') as string,
      },
      body:JSON.stringify({banco:values})
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
              description: "Essa conta bancária já existe no banco de dados",
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
  }

  return(
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
              {edit && 
                  <FormField
                  control={form.control}
                  name="pastconta"
                  render={({ field }) => (
                      <FormItem style={{ marginBottom: '30px' }}>
                      <FormLabel>Conta bancária a ser mudada</FormLabel>
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
                name="nomebanco"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Nome do banco</FormLabel>
                    <FormControl>
                        <Input placeholder={selectedPastBanco.nome_banco || "Itau, Nubank, etc..."} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="banco"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Banco</FormLabel>
                    <FormControl>
                        <Input placeholder={selectedPastBanco.banco || "Número do banco (xxx)"} {...field} />
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
                        <Input placeholder={selectedPastBanco.agencia || "AAAA"} {...field} />
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
                        <Input placeholder={selectedPastBanco.conta || "xxxxxxxx"} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="saldoinicial"
                render={({ field }) => (
                    <FormItem style={{ marginBottom: '30px' }}>
                    <FormLabel>Saldo inicial</FormLabel>
                    <FormControl>
                        <Input placeholder={selectedPastBanco.saldo_inicial || "Ex: 999.90"} {...field} />
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