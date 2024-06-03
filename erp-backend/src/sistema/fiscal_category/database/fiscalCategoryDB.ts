import { SQLConnection } from "../../connect-sql";
import { DBTipoContas, newTipoContasSchema } from "../../schemas/this-api/schemas";
import { DBError } from "../../schemas/this-api/schemas";

export function getTipoContas(): Promise<DBTipoContas[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT indice,categoria_conta, nome_conta, pagar_receber FROM tipo_contas,categoria_contas
                WHERE categoria_conta=nome_categoria
                `,
                    (err, result) => {
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

export function newTipoContas(new_tipo:newTipoContasSchema): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`
                INSERT INTO tipo_contas(nome_conta,categoria_conta,indice) 
                VALUES ('${new_tipo.categoria}','${new_tipo.nome_tipo}','${parseInt(new_tipo.categoria.trim().slice(0,2))}')
                `,
                    (err, result) => {
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