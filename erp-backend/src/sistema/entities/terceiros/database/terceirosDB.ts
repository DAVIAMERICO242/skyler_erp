import { SQLConnection } from "../../../connect-sql";
import { Terceiro } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";

export function cadastroTerceiros(terceiro: Terceiro): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO terceiros (nome, cnpj_cpf, tipo, estado) VALUES 
                   ('${terceiro.nometerceiro}', '${terceiro.cnpjcpfterceiro}', '${terceiro.tipoterceiro}', '${terceiro.uf}')`,
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
