import { SQLConnection } from "../../../connect-sql";
import { Banco } from "../../../schemas/this-api/schemas";
import { DBError } from "../../../schemas/this-api/schemas";

export function cadastroBancos(banco: Banco): Promise<null|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`INSERT INTO bancos (banco, agencia, conta) VALUES 
                   ('${banco.banco}', '${banco.agencia}', '${banco.conta}')`,
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
