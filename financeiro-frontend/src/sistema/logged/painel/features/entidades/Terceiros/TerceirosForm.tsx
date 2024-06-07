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
import { useToast } from "@/components/ui/use-toast"
import { useTerceiros } from "./Terceiros";
import { TerceirosData } from "./Terceiros";
import { EditFieldAlert } from "../reusable/EditFieldAlert";
import { criarEditarTerceiros } from "../API/fetch";

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
          cnpjcpfterceiro: "",
          uf:"",
          tipoterceiro:""
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



      const [terceiroDataToBeEdited, setTerceiroDataToBeEdited] = useState<TerceirosData | undefined>([]);

      useEffect(()=>{
        if(identifier_value){
          const current_terceiro_data:(TerceirosData | undefined) = terceirosData?.filter((e)=>e.nome===identifier_value)[0]
          if(current_terceiro_data){
            setTerceiroDataToBeEdited(current_terceiro_data)
          }
        }
      },[identifier_value,terceirosData]);

      useEffect(()=>{
          form.reset({
            nometerceiro: terceiroDataToBeEdited?.nome,
            cnpjcpfterceiro: terceiroDataToBeEdited?.cnpj_cpf,
            uf:terceiroDataToBeEdited?.estado,
            tipoterceiro:terceiroDataToBeEdited?.tipo
          });
      },[terceiroDataToBeEdited])


    //form


    //logica submit
    const [loading,setLoading] = useState<boolean>(false);


    function onSubmit(values: z.infer<typeof terceirosSchema>) {
        console.log('form');
        console.log(values);
        setLoading(true);
        criarEditarTerceiros(edit,values).then((d)=>d.json())
          .then((d)=>{
            if(d.success){
              setOpen(false);
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
                  <FormLabel>{edit && <EditFieldAlert/>} {"Nome do terceiro"}</FormLabel>
                  <FormControl>
                      <Input placeholder={"nome terceiro"}  {...field}/>
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
                  <FormLabel>{edit && <EditFieldAlert/>} {"Tipo do terceiro" }</FormLabel>
                  <FormControl>
                      <Input placeholder={"fornecedor,cliente,etc.."} {...field} />
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
                  <FormLabel>{edit && <EditFieldAlert/>} {"CNPJ/CPF sem máscara"}</FormLabel>
                  <FormControl>
                      <Input placeholder={"CNPJ/CPF"} {...field} />
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
                  <FormLabel>{edit && <EditFieldAlert/>} {"Estado"}</FormLabel>
                  <FormControl>
                      <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[100%]">
                          <SelectValue placeholder={terceiroDataToBeEdited?.estado || "Escolher"} />
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