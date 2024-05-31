import { SQLConnection } from "../../connect-sql";
import { DBTipoContas } from "../../schemas/this-api/schemas";
import { DBError } from "../../schemas/this-api/schemas";

export function getTipoContas(): Promise<DBTipoContas[]|DBError> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                connection.query(`SELECT indice,categoria_conta, nome_conta, pagar_receber FROM tipo_contas,categoria_contas
                WHERE categoria_conta=nome_categoria
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