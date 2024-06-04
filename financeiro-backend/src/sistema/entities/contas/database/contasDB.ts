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
                    if(result[0].maxId || result[0].maxId===0){
                        var novoId:number = result[0].maxId + 1;
                    }else{
                        var novoId:number = 0;
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

export function getHistoricoConta(): Promise<DBHistoricoContas[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT * FROM historico_contas`,
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
