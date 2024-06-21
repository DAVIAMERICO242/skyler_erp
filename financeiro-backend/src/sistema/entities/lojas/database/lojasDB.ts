import { SQLConnection } from "../../../connect-sql";
import { LojaFrontendFormInput } from "../../../schemas/this-api/schemas";
import { changeLojaFrontendFormInput } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";
import { DBLoja } from "../../../schemas/this-api/schemas";

export function cadastroLoja(loja: LojaFrontendFormInput): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO lojas (nome, razao, cnpj) VALUES 
                   ('${loja.nomeloja}', '${loja.razaoloja}', '${loja.cnpjloja}')`,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    });
}

export function getLojas(): Promise<DBLoja[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT * FROM lojas ORDER BY nome`,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(result);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    });
}

export function updateLoja(loja: changeLojaFrontendFormInput): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `UPDATE lojas SET
                    nome='${loja.nomeloja}',
                    razao='${loja.razaoloja}',
                    cnpj='${loja.cnpjloja}'
                    WHERE nome='${loja.pastnomeloja}'
                    `,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    })
}

export function deleteLoja(loja: string): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`DELETE FROM lojas WHERE nome='${loja}'`,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else{
                                reject({
                                    duplicate:false
                                })
                            }
                        } else {
                            resolve(null);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    })
}
