import mysql, { Connection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

export function SQLConnection():Promise<Connection|null>{
    return new Promise((resolve,reject)=>{
        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME
        });
        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ');
                reject(null);
                return;
            }
            resolve(connection);
        });
    })

}