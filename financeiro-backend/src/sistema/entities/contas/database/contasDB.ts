import { SQLConnection } from "../../../connect-sql";
import { DBError, StatisticContas } from "../../../schemas/this-api/schemas";
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
                let query:string;
                let state:("parcial" |"resolvido" | null );
                if (conta.value === 0) {
                    state = null;
                } else if (conta.value < conta.required_value) {
                    state = "parcial";
                } else {
                    state = "resolvido";
                }

                const stateQuery = state === null ? "NULL" : `'${state}'`;

                if(state!==null){
                    query = 
                    `UPDATE historico_contas SET
                    data_resolucao='${conta.data_resolucao.slice(0,10)}',
                    valor_resolucao='${conta.value}',
                    situacao=${stateQuery}
                    WHERE id='${conta.id}'
                    `
                }else{
                    query = 
                    `UPDATE historico_contas SET
                    data_resolucao=NULL,
                    valor_resolucao=NULL,
                    nossa_conta_bancaria=NULL,
                    situacao=${stateQuery}
                    WHERE id='${conta.id}'
                    `
                }

                connection.query(query,
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
                    if(result[0]?.maxId){
                        var novoId:number = result[0]?.maxId + 1;
                    }else{
                        var novoId:number = 1;
                    }
                    connection.query(`INSERT INTO historico_contas
                    (id, data, vencimento, competencia, previsao, conta_tipo, terceiro,id_grupo,loja, valor, nossa_conta_bancaria) VALUES 
                    (${novoId},
                    '${dateSQLStandard(new Date())}',
                    '${novo_historico.vencimento.slice(0,10)}',
                    '${novo_historico.competencia.slice(0,10)}',
                    '${novo_historico.previsao.slice(0,10)}',
                    '${novo_historico.tipo_fiscal}',
                    '${novo_historico.terceiro}',
                    '${novo_historico.id_grupo}',
                    '${novo_historico.loja}',
                    '${novo_historico.valor}',
                    '${novo_historico.nossa_conta_bancaria}'
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
    ):Promise<{data:DBHistoricoContas[],statistics:StatisticContas,n_pages:number}|DBError> {
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
                        historico_contas.competencia,
                        historico_contas.previsao,
                        historico_contas.data_resolucao, 
                        historico_contas.terceiro,
                        grupo_contas.nome_grupo AS nome_grupo,
                        historico_contas.id_grupo,
                        historico_contas.loja as loja,
                        historico_contas.nossa_conta_bancaria,
                        tipo_contas.categoria_conta,
                        historico_contas.conta_tipo, 
                        categoria_contas.pagar_receber, 
                        historico_contas.valor, 
                        historico_contas.valor_resolucao 
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                    ORDER BY historico_contas.id DESC
                    `
                // var nonNullFilters = [];
                if(page){
                    query+=` LIMIT ${page_size} OFFSET ${start_index};`
                }
                const n_pages = await getNumberOfPages(page_size);
                const pago = await getPagoSemFiltro();
                const recebido = await getRecebidoSemFiltro();
                const a_pagar = await getAPagarSemFiltro();
                const a_receber = await getAReceberSemFiltro();
                const statistics:StatisticContas = {
                    'pago':pago as number,
                    'recebido':recebido as number,
                    'a_pagar':a_pagar as number,
                    'a_receber':a_receber as number
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
                            resolve({
                                data:result,
                                statistics:statistics,
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
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
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
    ):Promise<{data:DBHistoricoContas[],statistics?:StatisticContas,n_pages:number}|DBError> {
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
                        historico_contas.competencia,
                        historico_contas.previsao,
                        historico_contas.data_resolucao, 
                        historico_contas.terceiro,
                        grupo_contas.nome_grupo AS nome_grupo,
                        historico_contas.id_grupo,
                        historico_contas.loja as loja,
                        historico_contas.nossa_conta_bancaria,
                        tipo_contas.categoria_conta,
                        historico_contas.conta_tipo, 
                        categoria_contas.pagar_receber, 
                        historico_contas.valor, 
                        historico_contas.valor_resolucao 
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                    `
                var filtersQuery = ``;
                var check_first_if = true;
                var check_first_run_vencimento = true;
                var check_first_run_competencia = true;
                var check_first_run_resolucao = true;
                var check_first_run_previsao = true;
                //BY DAVI AMERICO
                for (let key of Object.keys(filter) as (keyof SchemaContasFilterObject)[]) {
                    if (filter[key] && key!=='situacao') {
                        if(!isStringDate(filter[key]) && key!=="id_grupo"){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE ${key}='${filter[key]}'`
                                check_first_if = false;
                            }else{
                                filtersQuery = filtersQuery + ` AND ${key}='${filter[key]}'`
                            }
                        }else if(key==="id_grupo"){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE historico_contas.id_grupo='${filter[key]}'`
                                check_first_if = false;
                            }else{
                                filtersQuery = filtersQuery + ` AND historico_contas.id_grupo='${filter[key]}'`
                            }
                        }
                        else if(isStringDate(filter[key])){
                            if(!(key.includes('vencimento')) && !(key.includes('competencia')) && !(key.includes('data_resolucao')) && !(key.includes('previsao'))){//se a data nao é intervalar
                                if(check_first_if){
                                    filtersQuery = filtersQuery + ` WHERE ${key}='${filter[key]?.slice(0,10)}'`
                                    check_first_if = false;
                                }else{
                                    filtersQuery = filtersQuery + ` AND ${key}='${filter[key]?.slice(0,10)}'`
                                }
                            }else if(check_first_run_vencimento && (key.includes('vencimento'))){
                                if(check_first_if){
                                    if(!filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento>='${filter['vencimento_inicio']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }
                                    else if(!filter['vencimento_inicio']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }else if(filter['vencimento_inicio'] && filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` WHERE vencimento>='${filter['vencimento_inicio']?.slice(0,10)}' AND vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                        check_first_if = false;
                                    }
                                }else{
                                    if(!filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` AND vencimento>='${filter['vencimento_inicio']?.slice(0,10)}'`
                                    }
                                    else if(!filter['vencimento_inicio']){
                                        filtersQuery = filtersQuery + ` AND vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                    }else if(filter['vencimento_inicio'] && filter['vencimento_fim']){
                                        filtersQuery = filtersQuery + ` AND vencimento>='${filter['vencimento_inicio']?.slice(0,10)}' AND vencimento<='${filter['vencimento_fim']?.slice(0,10)}'`
                                    }
                                }
                                check_first_run_vencimento = false;
                            }
                            //linear
                            else if(check_first_run_competencia && (key.includes('competencia'))){
                                if(check_first_if){
                                    if(!filter['competencia_fim']){
                                        filtersQuery = filtersQuery + ` WHERE competencia>='${filter['competencia_inicio']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }
                                    else if(!filter['competencia_inicio']){
                                        filtersQuery = filtersQuery + ` WHERE competencia<='${filter['competencia_fim']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }else if(filter['competencia_inicio'] && filter['competencia_fim']){
                                        filtersQuery = filtersQuery + ` WHERE competencia>='${filter['competencia_inicio']?.slice(0,10)}' AND competencia<='${filter['competencia_fim']?.slice(0,10)}'`
                                        check_first_if = false;
                                    }
                                }else{
                                    if(!filter['competencia_fim']){
                                        filtersQuery = filtersQuery + ` AND competencia>='${filter['competencia_inicio']?.slice(0,10)}'`
                                    }
                                    else if(!filter['competencia_inicio']){
                                        filtersQuery = filtersQuery + ` AND competencia<='${filter['competencia_fim']?.slice(0,10)}'`
                                    }else if(filter['competencia_inicio'] && filter['competencia_fim']){
                                        filtersQuery = filtersQuery + ` AND competencia>='${filter['competencia_inicio']?.slice(0,10)}' AND competencia<='${filter['competencia_fim']?.slice(0,10)}'`
                                    }
                                }
                                check_first_run_competencia = false;
                            }
                            //INTERVALO DATA RESOLUCAO
                            else if(check_first_run_resolucao && (key.includes('data_resolucao'))){
                                if(check_first_if){
                                    if(!filter['data_resolucao_fim']){
                                        filtersQuery = filtersQuery + ` WHERE data_resolucao>='${filter['data_resolucao_inicio']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }
                                    else if(!filter['data_resolucao_inicio']){
                                        filtersQuery = filtersQuery + ` WHERE data_resolucao<='${filter['data_resolucao_fim']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }else if(filter['data_resolucao_inicio'] && filter['data_resolucao_fim']){
                                        filtersQuery = filtersQuery + ` WHERE data_resolucao>='${filter['data_resolucao_inicio']?.slice(0,10)}' AND data_resolucao<='${filter['data_resolucao_fim']?.slice(0,10)}'`
                                        check_first_if = false;
                                    }
                                }else{
                                    if(!filter['data_resolucao_fim']){
                                        filtersQuery = filtersQuery + ` AND data_resolucao>='${filter['data_resolucao_inicio']?.slice(0,10)}'`
                                    }
                                    else if(!filter['data_resolucao_inicio']){
                                        filtersQuery = filtersQuery + ` AND data_resolucao<='${filter['data_resolucao_fim']?.slice(0,10)}'`
                                    }else if(filter['data_resolucao_inicio'] && filter['data_resolucao_fim']){
                                        filtersQuery = filtersQuery + ` AND data_resolucao>='${filter['data_resolucao_inicio']?.slice(0,10)}' AND data_resolucao<='${filter['data_resolucao_fim']?.slice(0,10)}'`
                                    }
                                }
                                check_first_run_resolucao = false;
                            }

                            //previsao
                            else if(check_first_run_previsao && (key.includes('previsao'))){
                                if(check_first_if){
                                    if(!filter['previsao_fim']){
                                        filtersQuery = filtersQuery + ` WHERE previsao>='${filter['previsao_inicio']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }
                                    else if(!filter['previsao_inicio']){
                                        filtersQuery = filtersQuery + ` WHERE previsao<='${filter['previsao_fim']?.slice(0,10)}'`
                                        check_first_if = false;   
                                    }else if(filter['previsao_inicio'] && filter['previsao_fim']){
                                        filtersQuery = filtersQuery + ` WHERE previsao>='${filter['previsao_inicio']?.slice(0,10)}' AND previsao<='${filter['previsao_fim']?.slice(0,10)}'`
                                        check_first_if = false;
                                    }
                                }else{
                                    if(!filter['previsao_fim']){
                                        filtersQuery = filtersQuery + ` AND previsao>='${filter['previsao_inicio']?.slice(0,10)}'`
                                    }
                                    else if(!filter['previsao_inicio']){
                                        filtersQuery = filtersQuery + ` AND previsao<='${filter['previsao_fim']?.slice(0,10)}'`
                                    }else if(filter['previsao_inicio'] && filter['previsao_fim']){
                                        filtersQuery = filtersQuery + ` AND previsao>='${filter['previsao_inicio']?.slice(0,10)}' AND previsao<='${filter['previsao_fim']?.slice(0,10)}'`
                                    }
                                }
                                check_first_run_previsao = false;
                            }
                        }
                    }else if (filter.hasOwnProperty('situacao') && filter['situacao']?.length){
                        //sem nulo (não resolvido)
                        if(filter['situacao'].length===1 && !(filter['situacao'].includes(null))){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE situacao='${filter['situacao'][0]}'`;
                                check_first_if = false;   
                            }else{
                                filtersQuery = filtersQuery + ` AND situacao='${filter['situacao'][0]}'`
                            }
                        }else if(filter['situacao'].length===2 && !(filter['situacao'].includes(null))){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE (situacao='${filter['situacao'][0]}' OR situacao='${filter['situacao'][1]}')`;
                                check_first_if = false;   
                            }else{
                                filtersQuery = filtersQuery + ` AND (situacao='${filter['situacao'][0]}' OR situacao='${filter['situacao'][1]}')`
                            }  
                        }
                        //com nulo (não resolvido)
                        else if(filter['situacao'].length===1 && (filter['situacao'].includes(null))){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE situacao IS NULL`;
                                check_first_if = false;   
                            }else{
                                filtersQuery = filtersQuery + ` AND situacao IS NULL`
                            }
                        }else if(filter['situacao'].length===2 && (filter['situacao'].includes(null))){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE (situacao='${filter['situacao'].filter(e=>e!==null)[0]}' OR situacao IS NULL)`;
                                check_first_if = false;   
                            }else{
                                filtersQuery = filtersQuery + ` AND (situacao='${filter['situacao'].filter(e=>e!==null)[0]}' OR situacao IS NULL)`
                            }  
                        }else if(filter['situacao'].length===3 && (filter['situacao'].includes(null))){
                            if(check_first_if){
                                filtersQuery = filtersQuery + ` WHERE (situacao='${filter['situacao'].filter(e=>e!==null)[0]}' OR situacao='${filter['situacao'].filter(e=>e!==null)[1]}' OR situacao IS NULL)`;
                                check_first_if = false;   
                            }else{
                                filtersQuery = filtersQuery + ` AND (situacao='${filter['situacao'].filter(e=>e!==null)[0]}' OR situacao='${filter['situacao'].filter(e=>e!==null)[1]}' OR situacao IS NULL)`
                            }  
                        }

                    }
                }

                query+=filtersQuery;
                const n_pages = await getFilteredNumberOfPages(query,page_size);//nao contar as paginas antes do limit e offset ser aplicado
                const pago = await getPagoComFiltro(filtersQuery);
                const recebido = await getRecebidoComFiltro(filtersQuery);
                const a_pagar = await getAPagarComFiltro(filtersQuery);
                const a_receber = await getAReceberComFiltro(filtersQuery);
                const statistics:StatisticContas = {
                    'pago':pago as number,
                    'recebido':recebido as number,
                    'a_pagar':a_pagar as number,
                    'a_receber':a_receber as number
                }
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
                                statistics:statistics,
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
                competencia='${conta.competencia.slice(0,10)}',
                conta_tipo='${conta.tipo_fiscal}',
                terceiro='${conta.terceiro}',
                id_grupo='${conta.id_grupo}',
                loja='${conta.loja}',
                previsao='${conta.previsao.slice(0,10)}',
                nossa_conta_bancaria='${conta.nossa_conta_bancaria}',
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
                            resolve(result[0]?.valor_resolucao);
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

export function getPagoComFiltro(filter_query:string): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            let query =
            `
            SELECT categoria_contas.pagar_receber, SUM(COALESCE(historico_contas.valor_resolucao,0)) AS SOMA
            FROM 
                historico_contas
            INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
            INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
            INNER JOIN
                grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
            `
            if(!filter_query){
                var final_part = ` WHERE 
                    (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                GROUP BY categoria_contas.pagar_receber;`
            }else{
                var final_part = ` AND 
                    (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                GROUP BY categoria_contas.pagar_receber;`  
            }

            query = query + filter_query + final_part;

            if (connection) {
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
                            console.log(result);
                            if(result?.filter((e:any)=>e.pagar_receber==="pagar")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="pagar")[0].SOMA);
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
    })
}

export function getRecebidoComFiltro(filter_query:string): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            let query =
            `
            SELECT categoria_contas.pagar_receber, SUM(COALESCE(historico_contas.valor_resolucao,0)) AS SOMA
            FROM 
                historico_contas
            INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
            INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
            INNER JOIN
                grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
            `
            if(!filter_query){
                var final_part = ` WHERE 
                    (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                GROUP BY categoria_contas.pagar_receber;`
            }else{
                var final_part = ` AND 
                    (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                GROUP BY categoria_contas.pagar_receber;`  
            }

            query = query + filter_query + final_part;
            console.log(query)
            if (connection) {
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
                            console.log(result);
                            if(result?.filter((e:any)=>e.pagar_receber==="receber")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="receber")[0].SOMA)
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
    })
}

export function getAPagarComFiltro(filter_query:string): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                let query = 
                `
                    SELECT 
                        categoria_contas.pagar_receber, (SUM(COALESCE(historico_contas.valor,0))-SUM(COALESCE(historico_contas.valor_resolucao,0))) AS SOMA 
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
               `
                const final_part = " GROUP BY categoria_contas.pagar_receber;"

                query = query + filter_query + final_part;

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
                            console.log(result);
                            if(result?.filter((e:any)=>e.pagar_receber==="pagar")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="pagar")[0].SOMA);
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
    })
}

export function getAReceberComFiltro(filter_query:string): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                let query = 
                `
                    SELECT 
                        categoria_contas.pagar_receber, (SUM(COALESCE(historico_contas.valor,0))-SUM(COALESCE(historico_contas.valor_resolucao,0))) AS SOMA 
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
               `
                const final_part = " GROUP BY categoria_contas.pagar_receber;"

                query = query + filter_query + final_part;

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
                            console.log(result);
                            if(result?.filter((e:any)=>e.pagar_receber==="receber")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="receber")[0].SOMA);
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
    })
}

export function getPagoSemFiltro(): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `
                    SELECT categoria_contas.pagar_receber, SUM(COALESCE(historico_contas.valor_resolucao,0)) AS SOMA
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                    WHERE 
                        (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                    GROUP BY categoria_contas.pagar_receber;
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
                            if(result?.filter((e:any)=>e.pagar_receber==="pagar")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="pagar")[0].SOMA);
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
    })
}

export function getRecebidoSemFiltro(): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `
                    SELECT categoria_contas.pagar_receber, SUM(COALESCE(historico_contas.valor_resolucao,0)) AS SOMA
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                    WHERE 
                        (historico_contas.situacao = "resolvido" OR historico_contas.situacao = "parcial")
                    GROUP BY categoria_contas.pagar_receber;
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
                            if(result?.filter((e:any)=>e.pagar_receber==="receber")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="receber")[0].SOMA);
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
    })
}


export function getAPagarSemFiltro(): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `
                        SELECT 
                            categoria_contas.pagar_receber, (SUM(COALESCE(historico_contas.valor,0))-SUM(COALESCE(historico_contas.valor_resolucao,0))) AS SOMA 
                        FROM 
                            historico_contas
                        INNER JOIN 
                            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                        INNER JOIN 
                            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                        INNER JOIN
                            grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                        GROUP BY categoria_contas.pagar_receber;
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
                            if(result?.filter((e:any)=>e.pagar_receber==="pagar")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="pagar")[0].SOMA);
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
    })
}

export function getAReceberSemFiltro(): Promise<(number|null)|DBError>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(
                    `
                        SELECT 
                            categoria_contas.pagar_receber, (SUM(COALESCE(historico_contas.valor,0))-SUM(COALESCE(historico_contas.valor_resolucao,0))) AS SOMA 
                        FROM 
                            historico_contas
                        INNER JOIN 
                            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                        INNER JOIN 
                            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                        INNER JOIN
                            grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                        GROUP BY categoria_contas.pagar_receber;
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
                            if(result?.filter((e:any)=>e.pagar_receber==="receber")[0]){
                                resolve(result?.filter((e:any)=>e.pagar_receber==="receber")[0].SOMA);
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
    })
}


