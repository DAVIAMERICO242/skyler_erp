import { SQLConnection } from "../../../connect-sql";
import { dateSQLStandard } from "../../../essentials";
import { ChartsSchema, DBError, requestedDRE, requestedDREContaCategory, theDRE } from "../../../schemas/this-api/schemas";

export function dreController(requested_dre:requestedDRE): Promise<theDRE[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let query = fullDREqueryController(requested_dre);
                connection.query(query,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            reject({
                                duplicate:false
                            })
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

function fullDREqueryController(requested_dre:requestedDRE):string{
    if(requested_dre.tipo_data==="pagamento_real"){
        return `
        SELECT 
                historico_contas.loja AS nome_loja,categoria_contas.nome_categoria AS categoria_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor_resolucao,0)) AS RESULTADO
                FROM 
                historico_contas
                INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE historico_contas.data_resolucao>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.data_resolucao<='${requested_dre.data_fim.slice(0,10)}'
                GROUP BY tipo_contas.indice,historico_contas.loja,tipo_contas.categoria_conta
                ORDER BY tipo_contas.indice;
        `
    }
    if(requested_dre.tipo_data==="pagamento_previsao"){
        return `
        SELECT 
                historico_contas.loja AS nome_loja,categoria_contas.nome_categoria AS categoria_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
                FROM 
                historico_contas
                INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE historico_contas.previsao>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.previsao<='${requested_dre.data_fim.slice(0,10)}'
                GROUP BY tipo_contas.indice,historico_contas.loja,tipo_contas.categoria_conta
                ORDER BY tipo_contas.indice;
        `
    }
    else if(requested_dre.tipo_data==="competencia"){//loja origem
        return `
        SELECT 
            historico_contas.loja AS nome_loja,categoria_contas.nome_categoria AS categoria_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
        FROM 
            historico_contas
        INNER JOIN 
            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
        INNER JOIN 
            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
        INNER JOIN
            grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
        WHERE historico_contas.competencia>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.competencia<='${requested_dre.data_fim.slice(0,10)}'
        GROUP BY tipo_contas.indice,historico_contas.loja,tipo_contas.categoria_conta
        ORDER BY tipo_contas.indice;
        `
    }
    else if(requested_dre.tipo_data==="vencimento"){//loja origem
        return `
            SELECT 
                historico_contas.loja AS nome_loja,categoria_contas.nome_categoria AS categoria_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
            FROM 
                historico_contas
            INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
            INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
            INNER JOIN
                grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
            WHERE historico_contas.vencimento>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.vencimento<='${requested_dre.data_fim.slice(0,10)}'
            GROUP BY tipo_contas.indice,historico_contas.loja,tipo_contas.categoria_conta
            ORDER BY tipo_contas.indice;
        `
    }else{
        return "";
    }
}


export function getCategoryDetailsController(category_request:requestedDREContaCategory): Promise<theDRE[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let query = categoryDetailsQueryController(category_request);
                connection.query(query,
                    (err, result) => {
                        connection.end(); // Simply close the connection
                        if (err) {
                            reject({
                                duplicate:false
                            })
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

function categoryDetailsQueryController(requested_dre:requestedDREContaCategory):string{
    if(requested_dre.filter.tipo_data==="pagamento_real"){
        return `
        SELECT 
                historico_contas.loja AS nome_loja,historico_contas.conta_tipo AS tipo_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor_resolucao,0)) AS RESULTADO
                FROM 
                historico_contas
                INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE historico_contas.data_resolucao>='${requested_dre.filter.data_inicio.slice(0,10)}' AND historico_contas.data_resolucao<='${requested_dre.filter.data_fim.slice(0,10)}'
                    AND categoria_contas.nome_categoria='${requested_dre.category}'
                GROUP BY historico_contas.loja,historico_contas.conta_tipo
        `
    }
    if(requested_dre.filter.tipo_data==="pagamento_previsao"){
        return `
        SELECT 
                historico_contas.loja AS nome_loja,historico_contas.conta_tipo AS tipo_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
                FROM 
                historico_contas
                INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE historico_contas.previsao>='${requested_dre.filter.data_inicio.slice(0,10)}' AND historico_contas.previsao<='${requested_dre.filter.data_fim.slice(0,10)}'
                    AND categoria_contas.nome_categoria='${requested_dre.category}'
                GROUP BY historico_contas.loja,historico_contas.conta_tipo
        `
    }
    else if(requested_dre.filter.tipo_data==="competencia"){//loja origem
        return `
        SELECT 
            historico_contas.loja AS nome_loja,historico_contas.conta_tipo AS tipo_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
        FROM 
            historico_contas
        INNER JOIN 
            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
        INNER JOIN 
            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
        INNER JOIN
            grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
        WHERE historico_contas.competencia>='${requested_dre.filter.data_inicio.slice(0,10)}' AND historico_contas.competencia<='${requested_dre.filter.data_fim.slice(0,10)}'
            AND categoria_contas.nome_categoria='${requested_dre.category}'
        GROUP BY historico_contas.loja,historico_contas.conta_tipo
        `
    }
    else if(requested_dre.filter.tipo_data==="vencimento"){//loja origem
        return `
            SELECT 
                historico_contas.loja AS nome_loja,historico_contas.conta_tipo AS tipo_fiscal,pagar_receber,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
            FROM 
                historico_contas
            INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
            INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
            INNER JOIN
                grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
            WHERE historico_contas.vencimento>='${requested_dre.filter.data_inicio.slice(0,10)}' AND historico_contas.vencimento<='${requested_dre.filter.data_fim.slice(0,10)}'
                AND categoria_contas.nome_categoria='${requested_dre.category}'
            GROUP BY historico_contas.loja,historico_contas.conta_tipo
        `
    }else{
        return "";
    }
}