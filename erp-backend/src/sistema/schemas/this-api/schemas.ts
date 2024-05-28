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
    nomeloja:string,
    razaoloja:string,
    cnpjloja:string
}

export interface Banco{
    banco:string,
    agencia:string,
    conta:string
}

export interface DBError{
    duplicate?:boolean,
    exists?:boolean
}