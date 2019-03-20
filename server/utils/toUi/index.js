let { defaultProps } = require('../index');

function successToUi(res, o) {
    let o = defaultProps(o, {s: 'success', m: '', d: {}});
    this.toUi(res, o);
};

function warningToUi(res, o) {
    let o = defaultProps(o, {s: 'success', m: '', d: {}});
    this.toUi(res, o);
};

function errorToUi(res, o) {
    let o = defaultProps(o, {s: 'success', m: '', d: {}});
    this.toUi(res, o);
};

function toUi(res, o) {
    let o = defaultProps(o, {s: 'success', m: '', d: {}});
    res.send(o);
};

module.exports = {
    successToUi,
    warningToUi,
    errorToUi,
    toUi
};