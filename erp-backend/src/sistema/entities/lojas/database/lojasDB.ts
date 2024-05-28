import { SQLConnection } from "../../../connect-sql";
import { Loja } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";

export function cadastroLojas(loja: Loja): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO lojas (nome, razao, cnpj) VALUES 
                   ('${loja.nomeloja}', '${loja.razaoloja}', '${loja.cnpjloja}')`,
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
