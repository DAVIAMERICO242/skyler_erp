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

export interface Terceiro{
    nometerceiro:string,
    uf:string,
    cnpjcpfterceiro:string
    tipoterceiro:string
}

export interface Loja{
    contaloja:string,
    nomeloja:string,
    razaoloja:string,
    cnpjloja:string
}

export interface Banco{
    nomebanco:string,
    banco:string,
    agencia:string,
    conta:string,
    saldoinicial:number
}

export interface CategoriaContas{
    nome_categoria:string,
    pagar_receber:string
}

export interface TipoContas{
    nome_conta:string,
    categoria_conta:string
    indice:number
}

export interface newTipoContasSchema{
    categoria:string,
    nome_tipo:string
}

export interface HistoricoContas{
    id:number,
    data:string,
    vencimento:string,
    tipo_fiscal:string,
    terceiro:string,
    valor:number,
    situacao:string
}

export interface changeHistoricoContas{
    pastid:number,
    id:number,
    data:string,
    vencimento:string,
    tipo_fiscal:string,
    terceiro:string,
    valor:number,
    situacao:string
}


export interface changeTerceiro extends Terceiro{
    pastnometerceiro:string
}

export interface changeLoja extends Loja{
    pastnomeloja:string
}

export interface changeBanco extends Banco{
    pastconta:string
}

export interface DBTerceiro{
    nome:string,
    cnpj_cpf:string,
    tipo:string,
    estado:string
}

export interface DBLoja{
    conta:string,
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
    data:string,
    vencimento:string,
    conta_tipo:string,
    terceiro:string,
    valor:number,
    situacao:string
}

export interface DBError{
    foreign_key?:boolean,
    duplicate?:boolean,
    exists?:boolean,
    error_msg?:string
}