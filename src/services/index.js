import $ from 'jquery';
import { toast } from 'react-toastify';

import { BaseUrl, Platform } from '../sConfig';
import { defaultProps } from '../utils/index';

class Services {
    constructor(props) {
        this.BaseUrl = BaseUrl;
        this.Platform = Platform;

        this.props = props;

        this.doAjax = this.doAjax.bind(this);
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
        this.toServer = this.toServer.bind(this);
    };

    success(o) {
        let {s, m} = o;
        m = m ? m.join(', ') : false;
        if (s === 'e') {
            this.error(o);
        } else if (m) {
            toast(m, {
                type: toast.TYPE[(s === 'success' ? 'SUCCESS' : 'WARNING')]
            });
        }
    };

    error(o) {
        window.location.href = window.location.origin + '/#/Error/' + (o && o.m ? o.m.join(', ') : '');
    };

    doAjax(props) {
        props = defaultProps(props, {async: true, type: 'GET', contentType: 'application/json', dataType: 'json'});
        let { url, async, type, contentType, dataType, data } = props,
            headers = {};
        headers['x-platform'] = 1;
        if (this.props && this.props.oUser) {
            headers['x-auth-token'] = this.props.oUser.get('token');
        }
        if (data) {
            data = JSON.stringify(data);
        }
        let doAjaxRequest = $.ajax({
            crossDomain: true,
            url: this.BaseUrl + url,
            headers,
            async,
            type,
            contentType,
            dataType,
            data
        });
        doAjaxRequest.then(this.success, this.error);
        return doAjaxRequest;
    };

    toServer(props) {
        return new Promise((resolve, reject)=> {
            props = defaultProps(props, {async: true, type: 'GET', contentType: 'application/json', dataType: 'json'});
            this.doAjax(props)
            .then((o)=> {
                let {s} = o;
                if (s === 's') {
                    resolve(o);
                } else {
                    reject(o);
                }
            })
        });
    };
};

export default Services;