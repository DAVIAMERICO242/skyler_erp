//esse arquivo mostra o nome das colunas da entidade de forma que o usuário entenda
//AS IMPORTAÇÕES É SO PRA EU VER O SCHEMA NO HOVER

import { SchemaTerceirosData } from "../../Terceiros/Terceiros";
import { SchemaBancosData } from "../../Bancos/Bancos";
import { SchemaLojasData } from "../../Lojas/Lojas";
import { SchemaContasFrontendData } from "../../Contas/local-contexts/contas-context";

export const getUIColumnName = (author:string,columnName:string)=>{
    switch (author){
        case 'terceiros':
            return TerceirosGetUIName(columnName)
        case 'bancos':
            return BancosGetUIName(columnName)
        case 'lojas':
            return LojasGetUIName(columnName)
        case 'contas':
            return ContasGetUIName(columnName)
        default:
            return columnName;
    }
}

function TerceirosGetUIName(columnName:string){
    switch(columnName){
        case 'nome':
            return 'Nome Terceiro';
        case 'cnpj_cpf':
            return 'CPNJ/CPF';
        case 'tipo':
            return 'Tipo';
        case 'estado':
            return 'ESTADO (uf)'
        default:
            return columnName;
    }
}

function BancosGetUIName(columnName:string){
    switch(columnName){
        case 'nome_banco':
            return 'Nome do banco';
        case 'banco':
            return 'N° do banco';
        case 'agencia':
            return 'Agência Bancária'
        case 'conta':
            return 'N° da conta';
        case 'saldo_inicial':
            return 'Saldo inicial'
        default:
            return columnName
    }
}

function LojasGetUIName(columnName:string){
    switch(columnName){
        case 'conta':
            return 'Conta Bancária';
        case 'nome':
            return 'Nome da Loja';
        case 'razao':
            return 'Razão Social';
        case 'cnpj':
            return 'CNPJ';
        default:
            return columnName;
    }
}


function ContasGetUIName(columnName:string){
    switch(columnName){
        case 'id':
            return 'ID';
        case 'situacao':
            return 'Situação';
        case 'data':
            return 'Lançamento';
        case 'vencimento':
            return 'Vencimento';
        case 'competencia':
            return 'Competência';
        case 'terceiro':
            return 'Terceiro';
        case 'categoria_conta':
            return 'Categoria Fiscal';
        case 'conta_tipo':
            return 'Tipo Fiscal';
        case 'pagar_receber':
            return 'Pagar ou receber?';
        case 'valor':
            return 'Valor';
        case 'data_resolucao':
            return 'Data da Transação';
        case 'valor_resolucao':
            return 'Valor da Transação';
        case 'nossa_conta_bancaria':
            return 'Conta Bancaria';
        case 'loja':
            return 'Loja';
        case 'previsao':
            return 'Previsão';
        default:
            return columnName
        
    }
}