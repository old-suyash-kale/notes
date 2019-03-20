let SqlString = require('sqlstring'),
    jwt = require('jsonwebtoken'),
    { oUser } = require('./User'),
    { oMySql } = require('./MySql'),
    { verify } = require('../utils/jwt/index'),
    { dateTimeNow } = require('../utils/index');

class Notes {
    constructor({oMySql, oUser}) {
        this.oMySql = oMySql;
        this.oUser = oUser;

        this.rAdd = this.rAdd.bind(this);
        this.rGet = this.rGet.bind(this);
        this.rUpdateTitle = this.rUpdateTitle.bind(this);
        this.rUpdatedDescription = this.rUpdatedDescription.bind(this);
        this.rTrash = this.rTrash.bind(this);
        this.rShare = this.rShare.bind(this);
        this.rNote = this.rNote.bind(this);
        this.rPin = this.rPin.bind(this);
    };

    add({user_id, title, description}) {
        return new Promise((resolve, reject)=> {
            console.log(`INSERT INTO notes (user_id, title, description, dt) VALUES (${SqlString.escape(user_id)}, ${SqlString.escape(title)}, ${SqlString.escape(description)}, '${dateTimeNow()}')`);
            this.oMySql.q(`INSERT INTO notes (user_id, title, description, dt) VALUES (${SqlString.escape(user_id)}, ${SqlString.escape(title)}, ${SqlString.escape(description)}, '${dateTimeNow()}')`,(err, { insertId })=> {
                if (err) {
                    reject({m: err.message});
                } else {
                    resolve({note_id: insertId});
                }
            });
        });
    };


    rAdd(req, res) {
        let { title, description } = req.oParams,
            user_id = this.oUser.get('user_id');
        this.add({user_id, title, description})
        .then(({ note_id })=> {
            res.successToUi({
                d: {note_id}
            });
        },(o)=> {
            res.errorToUi(o);
        });
    };

    rGet(req, res) {
        let user_id = this.oUser.get('user_id');
        this.oMySql.q(`SELECT notes.note_id, notes.title, notes.description, notes.pin, DATE_FORMAT(notes.dt, '%Y-%m-%d %k:%i:%s') AS dt FROM notes WHERE user_id=${SqlString.escape(user_id)} ORDER BY notes.pin DESC, notes.dt DESC`,(err, d)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                res.successToUi({
                    d
                });
             }
        });
    };

    rUpdateTitle(req, res) {
        let { note_id, title } = req.oParams,
            user_id = this.oUser.get('user_id'),
            dt = dateTimeNow();
        this.oMySql.q(`UPDATE notes SET title=${SqlString.escape(title)}, dt='${dt}' WHERE notes.note_id=${SqlString.escape(note_id)} AND notes.user_id=${SqlString.escape(user_id)}`,(err, to_do)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                req.app.io.emit(`update-title-${note_id}`, {
                    title,
                    dt
                });
                res.successToUi({m: ['']});
            }
        })
    };

    rUpdatedDescription(req, res) {
        let { note_id, description } = req.oParams,
            user_id = this.oUser.get('user_id'),
            dt = dateTimeNow();
        this.oMySql.q(`UPDATE notes SET description=${SqlString.escape(description)}, dt='${dt}' WHERE notes.note_id=${SqlString.escape(note_id)} AND notes.user_id=${SqlString.escape(user_id)}`,(err, to_do)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                console.log(`update-description-${note_id}`);
                req.app.io.emit(`update-description-${note_id}`, {
                    description,
                    dt
                });
                console.log('emit');
                res.successToUi({m: ['']});
            }
        });
    };

    rTrash(req, res) {
        let { note_id } = req.oParams,
            user_id = this.oUser.get('user_id');
        this.oMySql.q(`DELETE FROM notes WHERE notes.note_id=${SqlString.escape(note_id)} AND notes.user_id=${SqlString.escape(user_id)}`,(err)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                res.successToUi({m: ['Note trashed successfully!']});
            }
        });
    };

    rShare(req, res) {
        let { note_id } = req.oParams;
        res.successToUi({
            d: jwt.sign({note_id}, process.env.SECRET)
        });
    };

    rNote(req, res) {
        let { note } = req.oParams;
        jwt.verify(note, process.env.SECRET,(err, decoded)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                let { note_id } = decoded;
                this.oMySql.q(`SELECT user_details.fname, user_details.lname, notes.note_id, notes.title, notes.description, notes.pin, DATE_FORMAT(notes.dt, '%Y-%m-%d %k:%i:%s') AS dt FROM notes INNER JOIN user_details on notes.user_id = user_details.user_id WHERE notes.note_id=${SqlString.escape(note_id)}`,(err, d)=> {
                    if (err) {
                        res.errorToUi({m: [err.message]});
                    } else {
                        if (d && d.length) {
                            res.successToUi({
                                d: d[0]
                            });
                        } else {
                            res.errorToUi({m: ['Note not found!']});
                        }
                    }
                });
            }
        });
    };

    rPin(req, res) {
        let { pin, note_id } = req.oParams;
        this.oMySql.q(`UPDATE notes SET pin=${SqlString.escape(pin)} WHERE notes.note_id=${SqlString.escape(note_id)}`,(err)=> {
            if (err) {
                res.errorToUi({m: [err.message]});
            } else {
                this.rGet(req, res);
            }
        });
    };

};

let oNotes = new Notes({oMySql, oUser});

module.exports = {
    Notes,
    oNotes
};