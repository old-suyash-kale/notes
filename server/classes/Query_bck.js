class Query {

    constructor({Q}) {
        this.Q = Q;
    };

    release() {
        if (!this.Q) {
            return;
        }
        this.Q = null;
    };

    run({query, oFormat = true}) {
        return new Promise((resolve, reject)=> {
            this.Q
            .query(query, (err, rows)=> {
                if (err) {
                    reject({
                        err
                    });
                }
                if (oFormat) {
                    resolve({
                        rows
                    });
                } else {
                    resolve(rows);
                }
            });
        });
    };

    get(tables, props = {}) {
        let query = 'SELECT ',
            select = [],
            from = Object.keys(tables)[0],
            { where } = props;
        for (let table_name in tables) {
            let columns = tables[table_name];
            for (let column_name in columns) {
                let column = columns[column_name];
                select.push(`${table_name}.${column_name} AS ${(column.as || column_name)}`);
            };
        };
        query += select.join(', ');
        query += ` FROM ${from}`;
        if (props.joins) {
            for (let table_name in props.joins) {
                let join = props.joins[table_name];
                query += ` INNER JOIN ${table_name} ON ${join.on}`;
            };
        }
        if (where) {
            query += ` WHERE ${where}`;
        }
        return this.run({query});
    };

    post(tables) {
        let pArr = [];
        for (let table_name in tables) {
            let columns = tables[table_name],
                qColumnNames = [],
                qColumnValues = [];
            for (let column_name in columns) {
                let column = columns[column_name],
                    column_value = column.value || null;
                if (column_value && !column.number) {
                    column_value = `'${column_value}'`;
                }
                qColumnNames.push(column_name);
                qColumnValues.push(column_value);
            }
            qColumnNames = qColumnNames.join(', ');
            qColumnValues = qColumnValues.join(`, `);
            let pObj = this.run({
                query: `INSERT INTO ${table_name} (${qColumnNames}) VALUES (${qColumnValues})`,
                oFormat: false
            });
            pObj.catch((err)=> {
                console.log(`INSERT INTO ${table_name} (${qColumnNames}) VALUES (${qColumnValues})`);
                console.log(err);
                this.Q.rollback();
            });
            pArr.push(pObj);
        };
        return pArr.length > 1 ? Promise.all(pArr) : pArr[0];
    };

};

module.exports = {
    Query
};