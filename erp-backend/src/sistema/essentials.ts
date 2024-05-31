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