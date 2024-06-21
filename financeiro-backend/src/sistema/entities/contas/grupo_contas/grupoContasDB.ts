
import { SQLConnection } from "../../../connect-sql";
import { DBError, grupoContasDB, newGrupoContas} from "../../../schemas/this-api/schemas";
import { dateSQLStandard, isStringDate } from "../../../essentials";

//GRUPO CONTA É PRA RESOLVER A QUESTÃO DO RATEIO

export function cadastroGrupoConta(novo_grupo: newGrupoContas): Promise<{id:number}|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT MAX(id_grupo) AS maxId FROM grupo_contas`, (err, result)=>{
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
                    connection.query(
                    `INSERT INTO grupo_contas
                    (id_grupo, nome_grupo) VALUES 
                    (${novoId},
                     '${novo_grupo.nome_grupo}'
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
                            resolve({
                                id:novoId
                            });
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

export function getGrupoContas(): Promise<grupoContasDB[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                    connection.query(
                    `SELECT * FROM grupo_contas ORDER BY id_grupo DESC`,
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