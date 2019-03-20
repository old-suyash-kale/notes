let { oUser } = require('./User'),
    { oMySql } = require('./MySql'),
    { dateTimeNow } = require('../utils/index');

class ToDo {
    constructor({oMySql, oUsers}) {
        this.oMySql = oMySql;
        this.oUser = oUser;

        this.rAdd = this.rAdd.bind(this);
        this.rGet = this.rGet.bind(this);
        this.rUpdate = this.rUpdate.bind(this);
    };

    setStatus({to_do_id, status}) {
        return new Promise((resolve, reject)=> {
            this.oMySql.q(`INSERT INTO to_do_props (to_do_id, type, value, dt) VALUES (${to_do_id}, 1, '${status}', '${dateTimeNow()}')`,(err, {insertId})=> {
                if (err) {
                    reject({err});
                } else {
                    resolve();
                }
            });
        });
    };

    
    rAdd(req, res) {
        let { title } = req.oParams,
            user_id = this.oUser.get('user_id');
        this.oMySql.q(`INSERT INTO to_dos (user_id, title, dt) VALUES (${user_id}, '${title}', '${dateTimeNow()}')`,(err, {insertId})=> {
            let to_do_id = insertId;
            this.setStatus({to_do_id, status: '0'})
            .then(()=> {
                this.rGet(req, res);
            },({err})=> {
                res.errorToUi({m: [err.message]});
            });
        });
    };

    rGet(req, res) {
        let user_id = this.oUser.get('user_id');
        this.oMySql.q(`SELECT to_dos.to_do_id, to_dos.title, (SELECT to_do_props.value FROM to_do_props WHERE to_do_props.to_do_id=to_dos.to_do_id ORDER BY to_do_props.dt DESC LIMIT 1) AS status FROM to_dos WHERE to_dos.user_id=${user_id}`,(err, d)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                res.successToUi({
                    d
                });
             }
        })
    };

    rUpdate(req, res) {
        let { to_do_id, status } = req.oParams,
            user_id = this.oUser.get('user_id');
        this.oMySql.q(`SELECT to_dos.to_do_id, (SELECT to_do_props.value FROM to_do_props WHERE to_do_props.to_do_id=to_dos.to_do_id ORDER BY to_do_props.dt DESC LIMIT 1) AS status FROM to_dos WHERE to_dos.to_do_id=${to_do_id} AND to_dos.user_id=${user_id}`,(err, to_do)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                if (to_do.length) {
                    to_do = to_do[0];
                    if (to_do.status == status) {
                        res.warningToUi({m: [`ToDo already in ${status} status!`]});
                    } else {
                        this.setStatus({to_do_id, status})
                        .then(()=> {
                            this.rGet(req, res);
                        },({err})=> {
                            res.errorToUi({m: [err.message]});
                        });
                    }
                } else {
                    res.warningToUi({m: ['ToDo not found!']});
                }
            }
        })
    };

};

let oToDo = new ToDo({oMySql, oUser});

module.exports = {
    ToDo,
    oToDo
};