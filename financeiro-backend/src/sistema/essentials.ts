import { DBTipoContas } from "./schemas/this-api/schemas";

export function sortFiscalCategory(data:DBTipoContas[]){
    data.sort((a, b) => {
        if (a.indice !== b.indice) {
          return a.indice - b.indice;
        } else if (a.categoria_conta !== b.categoria_conta) {
          return a.categoria_conta.localeCompare(b.categoria_conta);
        } else {
          return a.nome_conta.localeCompare(b.nome_conta);
        }
      });
    return data;
      
}

export function dateSQLStandard(date:Date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isStringDate(value:string | undefined){

  if (typeof value !== "string"){
      return false;
  }else{
      const regex = /^\d{4}-\d{2}-\d{2}/;
      return !!regex.test(value)
  }
}
