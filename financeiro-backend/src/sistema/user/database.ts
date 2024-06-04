import { SQLConnection } from "../connect-sql";

export function checkMatchingPass(username:string,password:string):Promise<null|any[]>{
    return new Promise((resolve,reject)=>{
        SQLConnection().then((connection)=>{
            if (connection){
                connection.query(`SELECT * FROM users WHERE username = '${username}'
                AND password='${password}'`,(err,result)=>{
                    if(err){
                        reject(null);
                    }else{
                        resolve(result);
                    }
                })
            }
        }).catch((err)=>{
            reject(err);
        })
    })
}