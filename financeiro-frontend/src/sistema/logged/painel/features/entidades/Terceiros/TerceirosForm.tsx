/* eslint-disable no-var */
/* eslint-disable react-hooks/rules-of-hooks */
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useState,useEffect } from 'react';
import { LoadingButton } from '@/components/ui/LoadingButton';
import BACKEND_URL from '@/sistema/backend-urls';
import { useToast } from "@/components/ui/use-toast"
import { useTerceiros } from "./Terceiros";
import { TerceirosData } from "./Terceiros";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const TerceirosForm = ({edit,setOpen,identifier_value}:{edit:boolean, setOpen?:any, identifier_value?:string})=>{
    const terceirosData = useTerceiros().data;//cache dos dados
    const { refetch } = useTerceiros();

    const terceirosSchema = z.object({
      pastnometerceiro: z.string().min(2, {
        message: "O nome do terceiro deve ter no mínimo 2 caracteres",
      }).optional(),
      nometerceiro: z.string().min(2, {
        message: "O nome do terceiro deve ter no mínimo 2 caracteres",
      }),
      uf: z.string().min(2, {
          message: "UF deve ter no mínimo 2 caracteres",
        }),
      cnpjcpfterceiro: z.string().min(10, {
          message: "O campo deve ter no mínimo 10 caracteres",
        }).max(14, {
          message: "O campo deve ter no máximo 14 caracteres",
        }).regex(/^\d+$/, {
          message: "O campo deve conter apenas dígitos numéricos.",
        }),
      tipoterceiro: z.string().min(2,{
        message: "O tipo do terceiro deve ter no mínimo 2 caracteres"
      })
    });

    if(identifier_value){
      var form = useForm<z.infer<typeof terceirosSchema>>({
        resolver: zodResolver(terceirosSchema),
        defaultValues: {
          pastnometerceiro:identifier_value || "",
          nometerceiro: "",
          cnpjcpfterceiro: ""
        },
      });  
    }else{
      var form = useForm<z.infer<typeof terceirosSchema>>({
        resolver: zodResolver(terceirosSchema),
        defaultValues: {
          nometerceiro: "",
          cnpjcpfterceiro: ""
        },
      });        
    }
    const { toast } = useToast()

    //estados br
    interface estadosAPI{
        sigla:string;
    }

    const [BRStates, setBRStates] = useState<string[]>([]);
    useEffect(() => {
          fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
              .then((data) => data.json())
              .then((uf_data) => {
                console.log(uf_data)
                const estados = uf_data.map((e:estadosAPI)=>e.sigla).sort();
                console.log(estados)
                setBRStates(estados);
              });
      }, []);
    
    console.log(BRStates);

    //logica valida apenas para o modo edição

    const [selectedPastTerceiro, setSelectedPastTerceiro] = useState<TerceirosData>({});



      useEffect(()=>{
        if(identifier_value){
          const current_terceiro_data:(TerceirosData | undefined) = terceirosData?.filter((e)=>e.nome===identifier_value)[0]
          setSelectedPastTerceiro(current_terceiro_data || {})
        }
      },[identifier_value,terceirosData])

    

    //form


    //logica submit
    const [loading,setLoading] = useState<boolean>(false);


    function onSubmit(values: z.infer<typeof terceirosSchema>) {
        console.log('form');
        console.log(values);
        setLoading(true);
        fetch(BACKEND_URL+`/terceiros/${!edit?"cadastro":"update"}`,{
          method:"POST",
          headers:{
            'Content-type':"application/json",
            'token':localStorage.getItem('token') as string,
          },
          body:JSON.stringify({terceiro:values})
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

      return (
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {edit && 
              <FormField
              control={form.control}
              name="pastnometerceiro"
              render={({ field }) => (
                  <FormItem style={{ marginBottom: '30px' }}>
                  <FormLabel>Nome do terceiro a ser mudado</FormLabel>
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
              name="nometerceiro"
              render={({ field }) => (
                  <FormItem style={{ marginBottom: '30px' }}>
                  <FormLabel>{"Nome do terceiro " + (edit ? "(novo)":"")}</FormLabel>
                  <FormControl>
                      <Input placeholder={selectedPastTerceiro.nome || "nome terceiro"}  {...field}/>
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="tipoterceiro"
              render={({ field }) => (
                  <FormItem style={{ marginBottom: '30px' }}>
                  <FormLabel>{"Tipo do terceiro " + (edit ? "(novo)":"")}</FormLabel>
                  <FormControl>
                      <Input placeholder={selectedPastTerceiro.tipo ||"fornecedor,cliente,etc.."} {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="cnpjcpfterceiro"
              render={({ field }) => (
                  <FormItem style={{ marginBottom: '30px' }}>
                  <FormLabel>{"CNPJ/CPF sem máscara " + (edit ? "(novo)":"")}</FormLabel>
                  <FormControl>
                      <Input placeholder={selectedPastTerceiro.cnpj_cpf ||"CNPJ/CPF"} {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="uf"
              render={({ field }) => (
                  <FormItem  style={{ marginBottom: '30px' }}>
                  <FormLabel>{"Estado " + (!edit?"":"(novo)")}</FormLabel>
                  <FormControl>
                      <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[100%]">
                          <SelectValue placeholder={selectedPastTerceiro.estado?`Estado atual: ${selectedPastTerceiro.estado}`:"Escolher"} />
                      </SelectTrigger>
                      <SelectContent {...field }>
                          {BRStates.map((e)=>{
                              return (
                                  <SelectItem value={e}>{e}</SelectItem>
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
                type="skyler">{!edit?"Cadastrar":"Confirmar edição"}
              </LoadingButton>
          </form>
        </Form>
      )
}