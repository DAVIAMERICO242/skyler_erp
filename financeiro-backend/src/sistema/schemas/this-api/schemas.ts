import {Request} from "express";
import jwt,{JwtPayload} from 'jsonwebtoken';

export interface RequestModel extends Request{
    token?:string,
    username?:string,
    password?:string
}

export interface JwtModel extends JwtPayload {
    username?:string,
    password?:string
}

export interface TerceiroFrontendFormInput{
    nometerceiro:string,
    uf:string,
    cnpjcpfterceiro:string
    tipoterceiro:string
}

export interface LojaFrontendFormInput{
    nomeloja:string,
    razaoloja:string,
    cnpjloja:string
}

export interface BancoFrontendFormInput{
    nomebanco:string,
    banco:string,
    agencia:string,
    conta:string,
    saldoinicial:number
}
//EXCEÇÕES LÓGICAS
export interface CategoriaContas{//FRONTEND NAO CADASTRA ISSO
    nome_categoria:string,
    pagar_receber:string
}

export interface ChartsSchema{
    id?:number,
    vencimento?:string,
    terceiro?:string,
    valor?:number,
    valor_resolucao?:number
}

export interface TipoContas{//COMPATIVEL COM O NOME DO BANCO DE DADOS
    nome_conta:string,
    categoria_conta:string
    indice:number
}

export interface newTipoContasSchema{
    categoria:string,
    nome_tipo:string
}

export interface HistoricoContas{//IDENTICO NO FROTEND FORM
    id:number,
    data:string,
    vencimento:string,
    competencia:string,
    tipo_fiscal:string,
    terceiro:string,
    loja:string,
    valor:number,
    data_resolucao:string,
    valor_resolucao:number,
    nossa_conta_bancaria:string,
}

export interface changeHistoricoContas{//IDENTICO NO FROTEND FORM
    pastid:number,
    id:number,
    data:string,
    vencimento:string,
    competencia:string,
    tipo_fiscal:string,
    terceiro:string,
    loja:string,
    valor:number,
    data_resolucao:string,
    valor_resolucao:number,
    nossa_conta_bancaria:string,
}


export interface SchemaContasFilterObject{
    situacao?:("parcial" | "resolvido" | null)[],
    pagar_receber?:string,
    terceiro?:string,
    loja?:string,//pagamento,
    data?:string,
    vencimento_inicio?:string,
    vencimento_fim?:string,
    competencia_inicio?:string,
    competencia_fim?:string,
    data_resolucao_inicio?:string
    data_resolucao_fim?:string
}

export interface StatisticContas{
    pago?:number,
    recebido?:number,
    a_pagar?:number,
    a_receber?:number
}

export interface contaToBeResolved{
    id:number,
    value:number,
    required_value:number,
    data_resolucao:string,
    contaloja:string
}
////

export interface changeTerceiroFrontendFormInput extends TerceiroFrontendFormInput{
    pastnometerceiro:string
}

export interface changeLojaFrontendFormInput extends LojaFrontendFormInput{
    pastnomeloja:string
}

export interface changeBancoFrontendFormInput extends BancoFrontendFormInput{
    pastconta:string
}

export interface DBTerceiro{
    nome:string,
    cnpj_cpf:string,
    tipo:string,
    estado:string
}

export interface DBLoja{
    nome:string,
    razao:string,
    cnpj:string
}

export interface DBBanco{
    nome_banco:string,
    banco:string,
    agencia:string,
    conta:string,
    saldo_inicial:number
}

export interface DBCategoriaContas{
    nome_categoria:string,
    pagar_receber:string
}

export interface DBTipoContas{
    nome_conta:string,
    categoria_conta:string,
    indice:number

}

export interface DBHistoricoContas{
    id:number,
    situacao:"parcial"|null|"resolvido",
    data:string,
    vencimento:string,
    competencia:string,
    tipo_fiscal:string,
    terceiro:string,
    loja:string,
    valor:number,
    data_resolucao:string,
    valor_resolucao:number,
    nossa_conta_bancaria:string,
}

export interface DBError{
    foreign_key?:boolean,
    duplicate?:boolean,
    exists?:boolean,
    error_msg?:string
}

export interface requestedDRE{
    tipo_data: ("competencia"|"vencimento"|"pagamento")
    data_inicio:string,
    data_fim:string
}

export interface theDRE{
    nome_loja?:string,
    categoria_fiscal?:string,
    pagar_receber?:string,
    RESULTADO?:string
}