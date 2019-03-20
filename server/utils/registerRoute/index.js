let { oMySql } = require('../../classes/MySql'),
    { oUser } = require('../../classes/User'),
    { defaultProps } = require('../../utils/index'),
    services = require('../../services.json');

// parsing all parameters from request;
function get_oParams(req, service) {
    let oParams = {},
        platform = req.headers['x-platform'],
        token = req.headers['x-auth-token'];
    if (platform) {
        oParams['platform'] = platform;
    }
    if (token) {
        oParams['token'] = token;
    }
    for (let k in service) {
        let props = service[k],
            pVal = (req.body[k] || req.query[k]) || req.params[k] || props.default;
        if (typeof pVal != "undefined") {
            oParams[k] = pVal;
        }
    };
    return oParams;
};

// validating all parameters from request;
function validate(service, oParams) {
    return new Promise((resolve, reject)=> {
        let eMessage = [];
        for (let k in service) {
            let props = service[k];
            if (!oParams[k] && props.required) {
                eMessage.push(props.required_message || `${props.label || k} is required!`);
            }

        };
        if (eMessage.length) {
            reject(eMessage);
        }
        resolve();
    });
};

// default route handler;
function registerRoute(url, props, foo) {
    props = defaultProps(props, {connection: true, auth: true, type: 'get'});
    let { connection, auth, type } = props,
        eParam = [`${this.BASE_URL}${url}`],
        service;
    try {
        service = services[url.split('/:')[0]][type];
    } catch (e) {};
    if (connection) {
        eParam.push(oMySql.connection_middleware);
    }
    if (auth && service) {
        eParam.push(oUser.auth_middleware);
        service['token'] = {
            label: 'Token',
            require: true
        };
    }
    eParam.push((req, res)=> {
        debugger;
        console.log(`Route '${req.url}' is executing;`);

        if (!service) {
            res.errorToUi({m: ['Route not configured!']});
        }
        let oParams = get_oParams(req, service);
        req.oParams = oParams;

        validate(service, oParams)
        .then(()=> {
            try {
                foo(req, res);
            } catch(d) {
                res.errorToUi(d);
            }
        },(m)=> {
            res.warningToUi({m});
        });
    });
    this.app[type].apply(this.app, eParam);
};

module.exports = {
    get_oParams,
    validate,
    registerRoute
};