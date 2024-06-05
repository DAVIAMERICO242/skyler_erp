/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/components/ui/use-toast"
import BACKEND_URL from "@/sistema/backend-urls";
import { useState } from "react";
import { useTerceiros } from "../../Terceiros/Terceiros";
import { useLojas } from "../../Lojas/Lojas";
import { useBancos } from "../../Bancos/Bancos";
import { useContas } from "../../Contas/local-contexts/contas-context";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { singularWord } from "@/sistema/essentials";

export const Deletar = ({author,identifier_value}:{author:string,identifier_value:string})=>{
    const { toast } = useToast();
    const [loading,setLoading] = useState<boolean>(false);

    switch (author){
      case "terceiros":
        var {data} = useTerceiros();
        var {refetch} = useTerceiros();
        var excel_name = "terceiros_cadastrados.xlsx"
        var identifier = "nome";
        break;
      case "lojas":
        var {data} = useLojas();
        var {refetch} = useLojas();
        var excel_name = "lojas_cadastradas.xlsx"
        var identifier = "nome";
        break;
      case "bancos":
        var {data} = useBancos();
        var {refetch} = useBancos();
        var excel_name = "bancos_cadastrados.xlsx";
        var identifier = "conta";
        break;
      case "contas":
        var {data} = useContas();
        var {refetch} = useContas();
        var excel_name = "historico_pagar_receber.xlsx";
        var identifier = "id";
        break;
    }

    function submit() {
        console.log('form');
        setLoading(true);
        fetch(BACKEND_URL+`/${author}/delete`,{
          method:"POST",
          headers:{
            'Content-type':"application/json",
            'token':localStorage.getItem('token') as string,
          },
          body:JSON.stringify({[singularWord(author)]:identifier_value})
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
      }

      return(
        <AlertDialog>
            <AlertDialogTrigger style={{color:"red"}}>Deletar</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Essa ação não pode ser desfeita
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={submit}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )

}