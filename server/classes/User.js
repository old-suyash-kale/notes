let { oMySql } = require('./MySql'),
    nodemailer = require('nodemailer'),
    { dateTimeNow } = require('../utils/index'),
    { hash, compare } = require('../utils/bcrypt/index'),
    { sign, verify } = require('../utils/jwt/index');

class User {
    constructor({oMySql}) {
        this.oMySql = oMySql;

        this.rSignup = this.rSignup.bind(this);
        this.rSignin = this.rSignin.bind(this);
        this.auth_middleware = this.auth_middleware.bind(this);
        this.rEmailVerify = this.rEmailVerify.bind(this);

        this.oUser = {};
    };

    get(p) {
        let { oUser } = this;
        return p ? oUser[p] : oUser;
    };

    genJwtToken(type = 1) {
        return new Promise((resolve, reject)=> {
            let { user_id, email } = this.oUser,
                token = sign({user_id, email}); // gen token with salt;
            this.oMySql.q(`INSERT INTO tokens (type, platform, token, user_id, dt) VALUES (${type}, ${this.platform}, '${token}', ${user_id}, '${dateTimeNow()}')`,(err)=> { // inserting in tokens table;
                if (err) { // error in inserting in tokens table;
                    reject({m: err.message});
                } else {
                    this.oUser.token = token;
                    resolve(token);
                }
            });
        });
    };

    login(res) {
        this.genJwtToken() // taking case of jwt token; 
        .then(()=> {
            res.setHeader('x-auth-token', this.oUser.token) // setting jwt token to header;
            res.set('x-auth-token', this.oUser.token) // setting jwt token to header;
            .header('x-auth-token', this.oUser.token) // setting jwt token to header;
            .successToUi({
                d: this.oUser
            }) // sending data to UI;
        },()=> {
            res.errorToUi();
        });
    };

    addDefaultNote({user_id}) {
        let title = 'Welcome To Notes!',
            description = 'Welcome To Notes ...';
        return new Promise((resolve, reject)=> {
            this.oMySql.q(`INSERT INTO notes (user_id, title, description, dt) VALUES (${user_id}, '${title}', '${description}', '${dateTimeNow()}')`,(err, { insertId })=> {
                if (err) {
                    reject({m: err.message});
                } else {
                    resolve({note_id: insertId});
                }
            });
        });
    };

    emailVerificaionSendEmail(oUser) {
        return new Promise((resolve, reject)=> {
            this.genJwtToken(2)
            .then((token)=> {
                let aUrl = 'http://notes.suyashkale.com/', // 'http://localhost:3000/',
                    eUrl = aUrl + `#/Email-Verification/${token}`;
                nodemailer.createTransport('smtp://no-reply@notes.suyashkale.com:no-reply1!@md-1.webhostbox.net').sendMail({
                    from: `"Notes" <no-reply@notes.suyashkale.com>`,
                    to: `${oUser.fname} <${oUser.email}>`,
                    subject: 'Email Verification - Notes',
                    text: '${aUrl}',
                    html: `Hello <strong>${oUser.fname}</strong>,<br />
                    Hope you are doing well.<br /><br />
                    
                    Welcome to <strong>Notes</strong>!<br /><br />
                    Please click the link below to verify you email:<br />
                    <a href='${eUrl}'><strong>Verify Email</strong></a><br />`
                },(err)=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            });
        });
    };


    rSignup(req, res) {
        let { email, password, fname, lname, platform } = req.oParams;
        this.platform = platform; // setting platform for further user;
        this.oMySql.q(`SELECT user_id FROM users WHERE email='${email}'`,(err, rows)=> { // checking email exists?;
            if (err) { // error in query;
                res.errorToUi({m: [err.message]});
            } else { // all is well;
                if (rows.length) { // email exist;
                    res.warningToUi({s: 'w', m: [`${email} is already registered!`]});
                } else { // fresh email;
                    console.log(password);
                    hash({password}) // hasing password for security;
                    .then((hPassword)=> { // got hashed password;
                        this.oMySql.q(`INSERT INTO users (email, password) VALUES ('${email}', '${hPassword}')`,(err, {insertId})=> {  // inserting in user table;
                            let user_id = insertId; // insertId Id is user_id;
                            if (err) { // error in inserting in user table;
                                res.errorToUi({m: [err.message]});
                            } else { // all is well;
                                this.oMySql.q(`INSERT INTO user_details (user_id, fname, lname) VALUES (${user_id}, '${fname}', '${lname}')`,(err)=> {  // insering in user detail table;
                                    if (err) { // error in inserting in user detail table;
                                        res.errorToUi({m: [err.message]});
                                    } else { // all is well;
                                        // setting user's value in class;
                                        this.oUser.user_id = user_id;
                                        this.oUser.email = email;
                                        this.oUser.fname = fname;
                                        this.oUser.lname = lname;
                                        this.oUser.email_verified = 0;
                                        this.emailVerificaionSendEmail(this.oUser).then(()=> {
                                            this.addDefaultNote({user_id}).then(()=> {
                                                this.login(res);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    },()=> { // error while hassing password;
                        res.errorToUi();
                    });
                }
            }
        });
    };

    rSignin(req, res) {
        let { email, password, platform } = req.oParams;
        this.platform = platform; // setting platform for further user;
        this.oMySql.q(`SELECT users.user_id, users.password, user_details.fname, user_details.lname, user_details.email_verified FROM users
        INNER JOIN user_details
        on users.user_id = user_details.user_id
        WHERE users.email='${email}'`,(err, rows)=> { // getting user's info for the email;
            if (err) { // in case of error from query;
                res.errorToUi({m: [err.message]});
            }
            if (rows.length) { // all is well;
                let oUser = rows[0];
                compare({password, hash: oUser.password}) // checking user's password!
                .then((bCompare)=> { // all is well;
                    if (bCompare) {
                        this.oUser.user_id = oUser.user_id;
                        this.oUser.email = email;
                        this.oUser.fname = oUser.fname;
                        this.oUser.lname = oUser.lname;
                        this.oUser.email_verified = oUser.email_verified;
                        this.login(res);
                    } else {
                        res.warningToUi({m: [`Password is incorrect!`]});
                    }
                },()=> { // password does not match;
                    res.errorToUi();
                });
            } else { // no user with the email;
                res.warningToUi({m: [`${email} is not registered!`]});
            }
        });
    };

    rEmailVerify(req, res) {
        let { eToken } = req.oParams;
        verify.call(this, eToken).then((vToken)=> {
            let { user_id, email } = vToken;
            this.oMySql.q(`SELECT tokens.token FROM tokens WHERE tokens.user_id=${user_id} AND tokens.type=2 ORDER BY tokens.dt DESC LIMIT 1`,(err, rows)=> {
                if (err) {
                    res.errorToUi({m: [err.message]});
                } else {
                    if (rows && rows[0] && rows[0].token == eToken) {
                        this.oMySql.q(`UPDATE user_details SET email_verified=1 WHERE user_details.user_id=${user_id}`,(err)=> {
                            if (err) {
                                res.errorToUi({m: [err.message]});
                            } else {
                                res.successToUi({
                                    d: { email },
                                    m: ['Email is verified successfully!']
                                });
                            }
                        });
                    } else {
                        res.warningToUi({
                            m: ['Email Token is not valid!']
                        });
                    }
                }
            });
        },()=> {

        });
    };

    auth_middleware(req, res, next) {
        let platform = req.headers['x-platform'],
            token = req.headers['x-auth-token'];
        verify(token)
        .then((decoded)=> {
            let user_id = decoded.user_id;
            if (!user_id) { // user_id not fount in token;
                res.errorToUi({m: ['User_id missing from token!']});
            } else if (!platform) { // checking for platform;
                res.errorToUi({m: ['Platform is required!']});
            } else if (!token) { // checking for token;
                res.errorToUi({m: ['Token is required!']});
            } else { // all is well;
                this.oMySql.q(`SELECT
                users.user_id, user_details.fname, user_details.lname,
                (SELECT tokens.token FROM tokens WHERE tokens.user_id=${user_id} AND platform=${platform} ORDER BY tokens.dt DESC LIMIT 1) AS token
                FROM users
                INNER JOIN user_details
                on users.user_id = user_details.user_id
                WHERE users.user_id=${user_id}`,(err, rows)=> {
                    if (err) { // error for query;
                        res.errorToUi({m: [err.message]});
                    } else { // all is well;
                        if (!rows.length) { // user not found;
                            res.errorToUi({m: ['User not found!']});
                        } else { // all is well;
                            let oUser = rows[0];
                            if (oUser.token == token) { // all is well;
                                next();
                            } else { // token dosen't match;
                                res.errorToUi({m: [`Token doesn't match!`]});
                            }
                        }
                    }
                });
            }
        },(err)=> {
            res.errorToUi({m: ['Invalid Token!']});
        });
    };
};

let oUser = new User({oMySql});

module.exports = {
    User,
    oUser
};