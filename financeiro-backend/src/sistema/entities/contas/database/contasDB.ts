import { SQLConnection } from "../../../connect-sql";
import { DBError } from "../../../schemas/this-api/schemas";
import { DBHistoricoContas } from "../../../schemas/this-api/schemas";
import { dateSQLStandard, isStringDate } from "../../../essentials";
import { changeHistoricoContas } from "../../../schemas/this-api/schemas";
import { HistoricoContas } from "../../../schemas/this-api/schemas";
import { contaToBeResolved } from "../../../schemas/this-api/schemas";
import { SchemaContasFilterObject } from "../../../schemas/this-api/schemas";

export function resolverConta(conta: contaToBeResolved): Promise<("parcial" |"resolvido" | null ) | DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let state:("parcial" |"resolvido" | null );
                if (conta.value === 0) {
                    state = null;
                } else if (conta.value < conta.required_value) {
                    state = "parcial";
                } else {
                    state = "resolvido";
                }

                const stateQuery = state === null ? "NULL" : `'${state}'`;

                connection.query(
                    `UPDATE historico_contas SET
                    data_resolucao='${conta.data_resolucao.slice(0,10)}',
                    valor_resolucao='${conta.value}',
                    nossa_conta_bancaria='${conta.contaloja}',
                    situacao=${stateQuery}
                    WHERE id='${conta.id}'
                    `,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            if (err.sqlMessage?.toUpperCase().includes("DUPLICATE")) {
                                reject({
                                    duplicate: true
                                });
                            } else {
                                reject({
                                    duplicate: false
                                });
                            }
                        } else {
                            resolve(state);
                        }
                    });
            }
        }).catch((err) => {
            reject({
                duplicate: false
            });
        });
    });
}



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

export async function getFrotendHistoricoConta(
    page:number,
    page_size:number,
    ):Promise<{data:DBHistoricoContas[],n_pages:number}|DBError> {
    console.log(page)
    const start_index = (page - 1) * page_size;
    return new Promise(async (resolve, reject) => {
        SQLConnection().then(async(connection) => {
            if (connection) {
                let query = 
                    `
                    SELECT 
                        historico_contas.id,
                        historico_contas.situacao,
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
                    ORDER BY historico_contas.id DESC
                    `
                // var nonNullFilters = [];
                if(page){
                    query+=` LIMIT ${page_size} OFFSET ${start_index};`
                }
                const n_pages = await getNumberOfPages(page_size);
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
                            resolve({
                                data:result,
                                n_pages:n_pages as number
                            });
                        }
                    });
            }
        }).catch((err) => {
            console.log(err);
            reject({
                duplicate:false
            });
        });
    });
}

export function getNumberOfPages(page_size:number): Promise<number|DBError> {
    let countQuery = `
                    SELECT COUNT(*) AS n_rows
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    LEFT JOIN
                        lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
                    ORDER BY historico_contas.id DESC
                    `
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(countQuery,
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

export async function getFilteredFrotendHistoricoConta(
    filter : SchemaContasFilterObject,
    page:number,
    page_size:number,
    ):Promise<{data:DBHistoricoContas[],n_pages:number}|DBError> {
    console.log(page)
    const start_index = (page - 1) * page_size;
    return new Promise(async (resolve, reject) => {
        SQLConnection().then(async(connection) => {
            if (connection) {
                let query = 
                    `
                    SELECT 
                        historico_contas.id,
                        historico_contas.situacao,
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
                    `
                var filtersQuery = ``;
                var check_first_if = true;
                var check_first_run_vencimento = true;
                for (let key of Object.keys(filter) as (keyof SchemaContasFilterObject)[]) {
                    if (filter[key]) {
                        if(key!=="nome_loja" && !isStringDate(filter[key])){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE ${key}='${filter[key]}'`
                                check_first_if = false;
                            }else{
                                filtersQuery = filtersQuery + ` AND ${key}='${filter[key]}'`
                            }
                        }else if(key==="nome_loja"){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE lojas.nome='${filter[key]}'`
                                check_first_if = false;
                            }else{
                                filtersQuery = filtersQuery + ` AND lojas.nome='${filter[key]}'`
                            }
                        }else if(isStringDate(filter[key])){
                            if(!(key.includes('vencimento'))){
                                if(check_first_if){
                                    filtersQuery = filtersQuery + ` WHERE ${key}='${filter[key]?.slice(0,10)}'`
                                    check_first_if = false;
                                }else{
                                    filtersQuery = filtersQuery + ` AND ${key}='${filter[key]?.slice(0,10)}'`
                                }
                            }else if(check_first_run_vencimento){
                                if(check_first_if){
                                    if(!filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento='${filter['vencimento_inicio']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }
                                    else if(!filter['vencimento_inicio']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento='${filter['vencimento_fim']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }else if(filter['vencimento_inicio'] && filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento>='${filter['vencimento_inicio']?.slice(0,10)}' AND vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                        check_first_if = false;
                                    }
                                }else{
                                    if(!filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` AND vencimento='${filter['vencimento_inicio']?.slice(0,10)}'`
                                    }
                                    else if(!filter['vencimento_inicio']){
                                        filtersQuery = filtersQuery + ` AND vencimento='${filter['vencimento_fim']?.slice(0,10)}'`
                                    }else if(filter['vencimento_inicio'] && filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` AND vencimento>='${filter['vencimento_inicio']?.slice(0,10)}' AND vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                    }
                                }
                                check_first_run_vencimento = false;
                            }
                        }
                    }else if (filter.hasOwnProperty('situacao')){
                        if(filter['situacao']===null){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE situacao is NULL`;
                                check_first_if=false;
                            }else{
                                filtersQuery = filtersQuery + ` AND situacao is NULL`
                            }
                        }

                    }
                }

                query+=filtersQuery;
                const n_pages = await getFilteredNumberOfPages(query,page_size);//nao contar as paginas antes do limit e offset ser aplicado
                let final_part = ` ORDER BY historico_contas.id DESC`
                if(page){
                    final_part = final_part + ` LIMIT ${page_size} OFFSET ${start_index};`
                }
                query+=final_part;
                // var nonNullFilters = [];
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
                            resolve({
                                data:result,
                                n_pages:n_pages as number
                            });
                        }
                    });
            }
        }).catch((err) => {
            console.log(err);
            reject({
                duplicate:false
            });
        });
    });
}

export function getFilteredNumberOfPages(query:string,page_size:number): Promise<number|DBError> {


    let countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) AS n_rows FROM');

    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(countQuery,
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
        SQLConnection().then(async (connection) => {
            if (connection) {
                var valor_resolvido = await getValorResolvido(conta.pastid);
                console.log('VALOR RESOLVIDO TIPO');
                console.log(typeof valor_resolvido);
                let new_situacao_chunk_query:string = "";
                if(valor_resolvido===null){
                    new_situacao_chunk_query = `,situacao = NULL`;
                }
                else if(conta.valor === valor_resolvido){
                    new_situacao_chunk_query = `,situacao='resolvido'`;
                }else if(typeof valor_resolvido === 'number' && valor_resolvido < conta.valor){
                    new_situacao_chunk_query = `,situacao='parcial'`;
                }
                var query =
                `UPDATE historico_contas SET
                vencimento='${conta.vencimento.slice(0,10)}',
                conta_tipo='${conta.tipo_fiscal}',
                terceiro='${conta.terceiro}',
                valor=${conta.valor}
                `
                query += new_situacao_chunk_query;
                query += ` WHERE id='${conta.pastid}'`;

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

export function getValorResolvido(id:number): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `SELECT historico_contas.valor_resolucao
                    FROM historico_contas
                    WHERE id=${id}
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
                            resolve(result[0].valor_resolucao);
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
