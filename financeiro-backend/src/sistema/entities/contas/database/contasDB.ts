import { SQLConnection } from "../../../connect-sql";
import { DBError } from "../../../schemas/this-api/schemas";
import { DBHistoricoContas } from "../../../schemas/this-api/schemas";
import { dateSQLStandard } from "../../../essentials";
import { changeHistoricoContas } from "../../../schemas/this-api/schemas";
import { HistoricoContas } from "../../../schemas/this-api/schemas";

export function cadastroHistoricoConta(novo_historico: HistoricoContas): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT MAX(id) AS maxId FROM historico_contas`, (err, result)=>{
                    if(err){
                        reject({
                            duplicate:true
                        })
                    }
                    if(result[0].maxId){
                        var novoId:number = result[0].maxId + 1;
                    }else{
                        var novoId:number = 1;
                    }
                    connection.query(`INSERT INTO historico_contas
                    (id, data, vencimento, conta_tipo, terceiro, valor) VALUES 
                    ('${novoId}',
                    '${dateSQLStandard(new Date())}',
                    '${novo_historico.vencimento.slice(0,10)}',
                    '${novo_historico.tipo_fiscal}',
                    '${novo_historico.terceiro}',
                    '${novo_historico.valor}'
                    )`,
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
                })
            }
        }).catch((err) => {
            reject({
                duplicate:false
            });
        });
    });
}

export function getFrotendHistoricoConta(page:number, page_size:number): Promise<DBHistoricoContas[]|DBError> {
    console.log(page)
    const start_index = (page - 1) * page_size;
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let query = 
                    `
                    SELECT 
                        historico_contas.id,
                        historico_contas.data, 
                        historico_contas.vencimento, 
                        historico_contas.terceiro, 
                        tipo_contas.categoria_conta,
                        historico_contas.conta_tipo, 
                        categoria_contas.pagar_receber, 
                        historico_contas.valor, 
                        historico_contas.data_resolucao, 
                        historico_contas.valor_resolucao, 
                        historico_contas.nossa_conta_bancaria, 
                        lojas.nome as nome_loja
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    LEFT JOIN
                        lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
                    ORDER BY historico_contas.data
                    `
                    if (page) {
                        query += `LIMIT ${page_size} OFFSET ${start_index};`;
                    }
                connection.query(query,
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


export function getNumberOfPages(page_size:number): Promise<number|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`
                    SELECT COUNT(*) as n_rows
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    LEFT JOIN
                        lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
                    ORDER BY historico_contas.data
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
                            resolve(Math.ceil((result[0]['n_rows'])/page_size));
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


export function updateHistoricoConta(conta: changeHistoricoContas): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `UPDATE historico_contas SET
                    vencimento='${conta.vencimento.slice(0,10)}',
                    conta_tipo='${conta.tipo_fiscal}',
                    terceiro='${conta.terceiro}',
                    valor='${conta.valor}'
                    WHERE id='${conta.pastid}'
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

export function deleteHistoricoConta(conta_id: number): Promise<null|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`DELETE FROM historico_contas WHERE id='${conta_id}'`,
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
