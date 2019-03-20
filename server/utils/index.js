let moment = require('moment');

function defaultProps(p, d) {
    for (let k in d) {
        if (k && !p.hasOwnProperty(k)) {
            p[k] = d[k];
        }
    };
    return p;
};

function pad(n, width, z) {
    z = z || '0';
    width = width || 2;
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function dateTimeNow() {
    return moment().utc().format('YYYY-MM-DD HH:mm:ss');
    // let d = new Date();
    // return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate()+1)} ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
};


module.exports = {
    defaultProps,
    pad,
    dateTimeNow
};