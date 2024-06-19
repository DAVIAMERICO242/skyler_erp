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

export function newTipoContas(new_tipo:newTipoContasSchema): Promise<null|DBError> {
    var index = 0;
    if(new_tipo.categoria.trim().toLowerCase().includes('outros')){
        index = 999;
    }else{
        index = parseInt(new_tipo.categoria.trim().slice(0,2))
    }

    return new Promise((resolve, reject) => {
        SQLConnection().then(async (connection) => {
            if (connection) {
                connection.query(`
                INSERT INTO tipo_contas(nome_conta,categoria_conta,indice) 
                VALUES ('${new_tipo.nome_tipo}','${new_tipo.categoria}','${index}')
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
    });
}

export function newIndexedCategory(new_category:{tipo:("pagar"|"receber"),nome:string}): Promise<null|DBError> {

    return new Promise((resolve, reject) => {
        SQLConnection().then(async (connection) => {
            if (connection) {
                let PreLastIndex = await getPreLastIndex();
                if(typeof PreLastIndex!=="number"){
                    reject(null);
                    return;
                }
                connection.query(
                `
                INSERT INTO categoria_contas(nome_categoria,pagar_receber) 
                VALUES ('${(PreLastIndex + 1) + " - " + new_category.nome}','${new_category.tipo}')
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
                            newTipoContas({categoria:((PreLastIndex + 1) + " - " + new_category.nome),nome_tipo:( ` subcategoria genérica ( ${new_category.nome} )`)});
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


function getPreLastIndex(): Promise<(number|null)|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                `
                    SELECT DISTINCT indice FROM tipo_contas ORDER BY indice DESC LIMIT 1 OFFSET 1;
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
                            if(result[0]){
                                resolve(result[0]['indice']);
                            }else{
                                resolve(null);
                            }
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