import { SQLConnection } from "../../connect-sql";
import { dateSQLStandard } from "../../essentials";
import { ChartsSchema, DBError } from "../../schemas/this-api/schemas";

export function resumoController(author:string): Promise<ChartsSchema[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                let query = queryController(author);
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

function queryController(author:string):string{
    if(author==="a_pagar_hoje"){
        return `
                 SELECT id,vencimento,terceiro,valor,valor_resolucao
                    FROM 
                        historico_contas
                    INNER JOIN 
                        tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                    INNER -JOIN 
                        categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                    INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                    WHERE pagar_receber='pagar' AND (situacao is NULL OR situacao='parcial')
                    AND vencimento='${dateSQLStandard(new Date())}'
                    ORDER BY historico_contas.id DESC
                `
    }else if(author==="a_receber_hoje"){
        return `
                SELECT id,vencimento,terceiro,valor,valor_resolucao
                FROM 
                    historico_contas
                INNER JOIN 
                    tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                    categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                        grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE pagar_receber='receber' AND (situacao is NULL OR situacao='parcial')
                AND vencimento='${dateSQLStandard(new Date())}'
                ORDER BY historico_contas.id DESC
            `

    }else if(author==="pagar_vencidas"){
        return `
                SELECT id,vencimento,terceiro,valor,valor_resolucao
                FROM 
                    historico_contas
                INNER JOIN 
                    tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
                INNER JOIN 
                    categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
                INNER JOIN
                    grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
                WHERE pagar_receber='pagar' AND (situacao is NULL OR situacao='parcial')
                AND '${dateSQLStandard(new Date())}'>vencimento
                ORDER BY historico_contas.id DESC
            `
    }else if (author==="receber_vencidas"){
        return `
        SELECT id,vencimento,terceiro,valor,valor_resolucao
        FROM 
            historico_contas
        INNER JOIN 
            tipo_contas ON tipo_contas.nome_conta = historico_contas.conta_tipo
        INNER JOIN 
            categoria_contas ON categoria_contas.nome_categoria = tipo_contas.categoria_conta
        INNER JOIN
            grupo_contas ON grupo_contas.id_grupo = historico_contas.id_grupo
        WHERE pagar_receber='receber' AND (situacao is NULL OR situacao='parcial')
        AND '${dateSQLStandard(new Date())}'>vencimento
        ORDER BY historico_contas.id DESC
    `

    }else{
        return "";
    }
}