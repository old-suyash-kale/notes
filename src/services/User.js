import Services from './index';

class User extends Services {
    constructor(props) {
        super(props);

        this.oUser = null;
    };

    get(p) {
        let { oUser } = this;
        return p ? oUser[p] : oUser;
    };

    set(oUser) {
        this.oUser = oUser;
        return this;
    };

    signin(data) {
        return this.toServer({
            url: 'Signin',
            type: 'POST',
			data: data
		});
    };

    signup(data) {
        return this.toServer({
            url: 'Signup',
            type: 'POST',
			data: data
		});
    };

    emailVerify({ eToken }) {
        return this.toServer({
            url: 'EmailVerify',
            type: 'POST',
			data: { eToken }
		});
    };
};

let oUser = new User({});

export {
    User,
    oUser
};