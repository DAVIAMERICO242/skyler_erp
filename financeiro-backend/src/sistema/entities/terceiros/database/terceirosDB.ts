import { SQLConnection } from "../../../connect-sql";
import { TerceiroFrontendFormInput } from "../../../schemas/this-api/schemas";
import { changeTerceiroFrontendFormInput } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";
import { DBTerceiro } from "../../../schemas/this-api/schemas";

export function cadastroTerceiro(terceiro: TerceiroFrontendFormInput): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO terceiros (nome, cnpj_cpf, tipo, estado) VALUES 
                   ('${terceiro.nometerceiro}', '${terceiro.cnpjcpfterceiro}', '${terceiro.tipoterceiro}', '${terceiro.uf}')`,
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


export function getTerceiros(): Promise<DBTerceiro[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT * FROM terceiros ORDER BY nome`,
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


export function updateTerceiro(terceiro: changeTerceiroFrontendFormInput): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `UPDATE terceiros SET
                    nome='${terceiro.nometerceiro}',
                    cnpj_cpf='${terceiro.cnpjcpfterceiro}',
                    tipo='${terceiro.tipoterceiro}',
                    estado='${terceiro.uf}'
                    WHERE nome='${terceiro.pastnometerceiro}'
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

export function deleteTerceiro(terceiro: string): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`DELETE FROM terceiros WHERE nome='${terceiro}'`,
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