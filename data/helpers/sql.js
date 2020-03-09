const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING
});

module.exports.query = (query) => {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if(err || !client) {
                reject(err);
            } else {
                client.query(query, (err, result) => {
                    done();
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                });
            }
        });
    })
}