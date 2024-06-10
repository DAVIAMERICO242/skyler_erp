/* eslint-disable @typescript-eslint/no-explicit-any */
import BACKEND_URL from "@/sistema/backend-urls";
import { singularWord } from "@/sistema/essentials";

export async function getTerceiros(){
    try {
        const response = await fetch(BACKEND_URL + '/terceiros/get',{
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem('token') as string
          }
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.log('erro');
        return;
      } 
}

export async function getLojas(){
    try {
        const response = await fetch(BACKEND_URL + '/lojas/get',{
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem('token') as string
          }
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.log('erro');
        return;
      } 
}

export async function getBancos(){
    try {
        const response = await fetch(BACKEND_URL + '/bancos/get',{
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem('token') as string
          }
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.log('erro');
        return;
      } 
}

export async function getCategoriasFiscais(){
    try {
        const response = await fetch(BACKEND_URL + '/categorias_fiscais/get',{
          headers:{
            "Content-type":"application/json",
            "token":localStorage.getItem('token') as string
          }
        });
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.log('erro');
        return;
      } 
}

export async function getContas(page:number){
  try {
      const response = await fetch(BACKEND_URL + `/contas/get?page=${page}`,{
          headers:{
          "Content-type":"application/json",
          "token":localStorage.getItem('token') as string
          }
      });
      const result = await response.json();
      return {
        data:result.data,
        n_pages:result.n_pages
      };
    } catch (error) {
      console.log('erro')
    } 
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function criarEditarTerceiros(edit:boolean,values:any){

    return fetch(BACKEND_URL+`/terceiros/${!edit?"cadastro":"update"}`,{
        method:"POST",
        headers:{
          'Content-type':"application/json",
          'token':localStorage.getItem('token') as string,
        },
        body:JSON.stringify({terceiro:values})
      })
}

export async function criarEditarLojas(edit:boolean,values:any){
    return fetch(BACKEND_URL+`/lojas/${!edit?"cadastro":"update"}`,{
        method:"POST",
        headers:{
          'Content-type':"application/json",
          'token':localStorage.getItem('token') as string,
        },
        body:JSON.stringify({loja:values})
      })
}

export async function criarEditarBancos(edit:boolean,values:any){
    return fetch(BACKEND_URL+`/bancos/${!edit?"cadastro":"update"}`,{
        method:"POST",
        headers:{
          'Content-type':"application/json",
          'token':localStorage.getItem('token') as string,
        },
        body:JSON.stringify({banco:values})
      })
}

export async function criarEditarContas(edit:boolean,values:any){
  return fetch(BACKEND_URL+`/contas/${!edit?"cadastro":"update"}`,{
    method:"POST",
    headers:{
      'Content-type':"application/json",
      'token':localStorage.getItem('token') as string,
    },
    body:JSON.stringify({conta:values})
  })
}

export async function DeleteEntity(author: string,identifier_value: any){
    return fetch(BACKEND_URL+`/${author}/delete`,{
        method:"POST",
        headers:{
          'Content-type':"application/json",
          'token':localStorage.getItem('token') as string,
        },
        body:JSON.stringify({[singularWord(author)]:identifier_value})
      })
}