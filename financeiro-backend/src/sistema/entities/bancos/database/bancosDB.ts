import { SQLConnection } from "../../../connect-sql";
import { BancoFrontendFormInput } from "../../../schemas/this-api/schemas";
import { changeBancoFrontendFormInput } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";
import { DBBanco } from "../../../schemas/this-api/schemas";

export function cadastroBanco(banco: BancoFrontendFormInput): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO bancos (nome_banco, banco, agencia, conta) VALUES 
                   ('${banco.nomebanco}','${banco.banco}', '${banco.agencia}', '${banco.conta}')`,
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

export function getBancos(): Promise<DBBanco[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT * FROM bancos ORDER BY nome_banco`,
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


export function updateBanco(conta: changeBancoFrontendFormInput): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `UPDATE bancos SET
                    nome_banco='${conta.nomebanco}',
                    banco='${conta.banco}',
                    agencia='${conta.agencia}',
                    conta='${conta.conta}'
                    WHERE conta='${conta.pastconta}'
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

export function deleteBanco(conta: string): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`DELETE FROM bancos WHERE conta='${conta}'`,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if(err.sqlMessage?.toUpperCase().includes("DUPLICATE")){
                                reject({
                                    duplicate:true
                                })
                            }else if(err.sqlMessage?.toUpperCase().includes("FOREIGN KEY")){
                                reject({
                                    foreign_key:true,
                                    duplicate:false
                                })
                            }
                            else{
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
