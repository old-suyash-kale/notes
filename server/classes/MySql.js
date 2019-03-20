let mysql = require('mysql');

const { HOST, USER, PASSWORD, DATABASE } = require('../configs/MYSQL');

class MySql {

    constructor({HOST, USER, PASSWORD, DATABASE}) {
        this.pool = mysql.createPool({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        this.Q = null;
        
        this.connection_middleware = this.connection_middleware.bind(this);
        this.q = this.q.bind(this);
    };

    connect() {
        return new Promise((resolve, reject)=> {
            if (this.Q) {
                resolve(this.Q);
            }
            this.pool
            .getConnection((err, Q)=> {
                if (err) {
                    reject(err);
                }
                this.Q = Q;
                resolve({Q});
            });
        });
    };

    q() {
        return this.Q.query.apply(this.Q, arguments);
    };

    release() {
        if (!this.Q) {
            return;
        }
        this.Q.release();
        this.Q = null;
        console.log('Connection release with database;');
    };

    connection_middleware(req, res, next) {
        this.connect().then(({Q})=> {
            req.Q = Q;
            console.log('Connection established with database;');
            next();
        }, (err)=> { // need to handle errors;
            console.log('Connection failed with database;');
        });
    };

};

let oMySql = new MySql({HOST, USER, PASSWORD, DATABASE});

module.exports = {
    MySql,
    oMySql
};