let jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

function create_secret() {
    return SECRET;
};

function sign({user_id, email}) {
    let oUser = {user_id, email};
    return jwt.sign(oUser, create_secret());
};

function verify(token) {
    return new Promise((resolve, reject)=> {
        jwt.verify(token, create_secret(), (err, decoded)=> {
            if (err) {
                debugger;
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    sign,
    verify
};
