import { SQLConnection } from "../sistema/connect-sql";
import { pagar } from "../sistema/automation out of node process/contas_tipo";
import { receber } from "../sistema/automation out of node process/contas_tipo";


class ControllerRandomFrontendContasInstance{

    generateRandomSituacao(){
        return this.getRandomItemFromArray(
            [
                'parcial',
                'resolvido',
                null
            ]
        )
    }

    getRandomContaBancaria(){
        return this.getRandomItemFromArray(
            [
                '11111111',
                '21321321',
                '23213213',
                '56456455'
            ]
        )
    }

    generateRandomLoja(){
        return this.getRandomItemFromArray(
            [
                'center um',
                'center um 3',
                'eewqdewq',
                'LOJA TESTE',
                'vitrine mall 3'
            ]
        )
    }
    
    generateRandomTerceiro(){
        return this.getRandomItemFromArray(
            [
                'davi','davi3','davi4','davi5','davi55','dwq','eddwqe'
            ]
        )
    }

    generateRandomRequiredValue(min=10, max=10000){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    generateRandomTipoFiscal (){
        if(Math.random()<=0.5){
            return this.getRandomItemFromArray(pagar);
        }else{
            return this.getRandomItemFromArray(receber);
        }
    }

    generateRandomDate () {
        const start = new Date(1970, 0, 1); // Data inicial (1 de janeiro de 1970)
        const end = new Date(); // Data final (hoje)
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      
        const year = randomDate.getFullYear();
        const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Mês de 0 a 11, adiciona 1 e preenche com zero à esquerda se necessário
        const day = String(randomDate.getDate()).padStart(2, '0'); // Dia do mês, preenche com zero à esquerda se necessário
      
        return `${year}-${month}-${day}`;
      };

    getRandomItemFromArray (arr:any){
        if (arr.length === 0) return undefined; // Retorna undefined se o array estiver vazio
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
      };

    
}

export class RandomFrontendContasInstance extends ControllerRandomFrontendContasInstance{
    
    getRandomRow(){
        return this.FazerSentido(this.getRandomRowSemSentido())
    }
    
    getRandomRowSemSentido(){
        return[
            this.generateRandomSituacao(),//situacao 0
            this.generateRandomDate(),//lançamento 1
            this.generateRandomDate(),//vencimento 2
            this.generateRandomDate(),//competencia 3
            this.generateRandomTipoFiscal(),//tipo fiscal 4
            this.generateRandomTerceiro(),//terceiro 5
            this.generateRandomLoja(),//loja origem 6
            this.generateRandomRequiredValue(),//valor 7
            this.generateRandomDate(),//data resolucao  8
            this.generateRandomRequiredValue(),//valor resolvido 9
            this.getRandomContaBancaria()// conta bancária 10
        ] 
    }

    FazerSentido(random_row:any[]){
        if(random_row[7]>random_row[9]){//se o valor de requerido e maior que o resolvido
            random_row[0] = "parcial";
         }else if(random_row[7]<random_row[9]){//aumentar o numero de resolvidos
           random_row[7] = random_row[9];
           random_row[0] = "resolvido";
         }else{
           random_row[0] = "resolvido";
         }
         if(Math.random()>=0.5 && (random_row[7]>random_row[9])){
           random_row[9] = null;//valor resolvido nulo
           random_row[0] = null;//solucao nula (nao resolvido)
           random_row[8] = null;//data resolucao nula
           random_row[10] = null;//conta bancaria nula
         }

         return random_row;
    }
}
