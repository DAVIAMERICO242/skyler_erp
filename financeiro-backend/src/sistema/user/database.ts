import { SQLConnection } from "../connect-sql";

export function checkMatchingPass(username: string, password: string): Promise<null | any[]> {
    return new Promise((resolve, reject) => {
        SQLConnection().then((connection) => {
            if (connection) {
                const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
                connection.query(query, [username, password], (err, result) => {
                    connection.end(); // Simply close the connection
                    if (err) {
                        reject(null);
                    } else {
                        resolve(result);
                    }
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
}
