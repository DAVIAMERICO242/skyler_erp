import { SQLConnection } from "../sistema/connect-sql";

import { RandomFrontendContasInstance } from "./randomization";

export function RandomCadastro(){
  return new Promise((resolve, reject) => {
      SQLConnection().then((connection) => {
          if (connection) {
              var random_row = (new RandomFrontendContasInstance).getRandomRow();
              connection.query(`SELECT MAX(id) AS maxId FROM historico_contas`, (err, result)=>{
                  if(err){
                      reject({
                          duplicate:true
                      })
                  }
                  if(result[0].maxId){
                      var novoId:number = result[0].maxId + 1;
                  }else{
                      var novoId:number = 1;
                  }
                  connection.query(`INSERT INTO historico_contas
                  (id, situacao ,data, vencimento, competencia, conta_tipo, terceiro, valor, data_resolucao,valor_resolucao,nossa_conta_bancaria) VALUES 
                  ('${novoId}',
                  '${random_row[0]}',
                  '${random_row[1]}',
                  '${random_row[2]}',
                  '${random_row[3]}',
                  '${random_row[4]}',
                  '${random_row[5]}',
                  '${random_row[6]}',
                  '${random_row[7]}',
                  '${random_row[8]}',
                  '${random_row[9]}'
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

async function BulkCadastro(){
  for (let i=0;i<=10000;i++){
    try{
      await RandomCadastro()
    }catch{
       console.log('erro')
    }
  }
}


BulkCadastro()