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

    const terceiros_refetch = useTerceiros().refetch;
    const lojas_refetch = useLojas().refetch;
    const bancos_refetch = useBancos().refetch;
    const contas_refetch = useContas().refetch

    switch (author){
      case "terceiros":
        var refetch = terceiros_refetch;
        break;
      case "lojas":
        var refetch = lojas_refetch;
        break;
      case "bancos":
        var refetch = bancos_refetch;
        break;
      case "contas":
        var refetch = contas_refetch;
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