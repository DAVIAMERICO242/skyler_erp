import { SQLConnection } from "../../../connect-sql";
import { dateSQLStandard } from "../../../essentials";
import { ChartsSchema, DBError, requestedDRE, theDRE } from "../../../schemas/this-api/schemas";

export function dreController(requested_dre:requestedDRE): Promise<theDRE[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let query = queryController(requested_dre);
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

function queryController(requested_dre:requestedDRE):string{
    if(requested_dre.tipo_data==="pagamento"){
        return `
        SELECT 
                lojas.nome,categoria_contas.nome_categoria,SUM(COALESCE(historico_contas.valor_resolucao,0)) AS RESULTADO
                FROM 
                historico_contas
                INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                LEFT JOIN
                lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
                WHERE historico_contas.data_resolucao>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.data_resolucao<='${requested_dre.data_fim.slice(0,10)}'
                GROUP BY tipo_contas.indice,lojas.nome,tipo_contas.categoria_conta
                ORDER BY tipo_contas.indice;
        `
    }
    else if(requested_dre.tipo_data==="competencia"){
        return `
        SELECT 
            lojas.nome,categoria_contas.nome_categoria,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
        FROM 
            historico_contas
        INNER JOIN 
            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
        INNER JOIN 
            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
        LEFT JOIN
        lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
        WHERE historico_contas.competencia>='${requested_dre.data_inicio.slice(0,10)}' AND historico_contas.competencia<='${requested_dre.data_fim.slice(0,10)}'
        GROUP BY tipo_contas.indice,lojas.nome,tipo_contas.categoria_conta
        ORDER BY tipo_contas.indice;
        `
    }
    else if(requested_dre.tipo_data==="vencimento"){
        return `
            SELECT 
                lojas.nome,categoria_contas.nome_categoria,SUM(COALESCE(historico_contas.valor,0)) AS RESULTADO
            FROM 
                historico_contas
            INNER JOIN 
                tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
            INNER JOIN 
                categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
            LEFT JOIN
                lojas ON lojas.conta = historico_contas.nossa_conta_bancaria
            WHERE historico_contas.vencimento>='2024-01-01' AND historico_contas.vencimento<='2024-07-07'
            GROUP BY tipo_contas.indice,lojas.nome,tipo_contas.categoria_conta
            ORDER BY tipo_contas.indice;
        `
    }else{
        return "";
    }
}
