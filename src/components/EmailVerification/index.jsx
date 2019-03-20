import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faCheck } from "@fortawesome/fontawesome-free-solid";

import { oUser } from '../../services/User';

class EmailVerification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blur: false,
			token: this.props.match.params.token,
			email: ''
		};
	};
	componentDidMount() {
		let { token } = this.state;
		if (token) {
			this.setState({ blur: true });
			oUser.emailVerify({ eToken: token })
			.then(({d})=> {
				let { email } = d;
				this.setState({ blur: false, email });
				// this.props.history.push(`/Signin/${email}`);
			}, (d)=> {
				debugger;
				this.setState({ blur: false });
			});
		}
		document.title = 'Notes - Email Verification';
	};
	render() {
		let { user } = this.props,
			{ token,  blur, email } = this.state;
		if (!token && user) {
			return(
				<div
					className={'container'}>
					<div
						className={'row'}>
						<div
							className={'col-md-8 offset-md-2 text-center'}>
							<h2	
								className={'mb-0'}>
								{'Email verification is pending ...'}
							</h2>
							<p
								className={'text-muted'}>
								{'Please verify you email address!'}
							</p>
							<p
								className={'text-muted'}>
								{`We have sent a verification email to `}<strong>{(user ? user.email : '')}</strong>{', Please click on the verification like to verify your email!'}
							</p>
							<p
								className={'text-muted text-center'}>
								<Link to={`/Signin/${email}`}>{'Click here to Signin again.'}</Link>
							</p>
						</div>
					</div>
				</div>
			);
		}
		if (blur) {
			return(
				<div
					className={'container'}>
					<div
						className={'row'}>
						<div
							className={'col-md-8 offset-md-2 text-center'}>
							<h2	
								className={'mb-0'}>
								{'Verifying email ...'}
							</h2>
							<p
								className={'text-muted'}>
								<FontAwesomeIcon
									spin
									icon={faSync}
									className={'mr-2'}
								/>
								{'Please wait, email verification in progress!'}
							</p>
						</div>
					</div>
				</div>
			);
		}
		if (email) {
			return(
				<div
					className={'container'}>
					<div
						className={'row'}>
						<div
							className={'col-md-8 offset-md-2 text-center'}>
							<h2	
								className={'mb-0'}>
								{'Verified email successfully ...'}
							</h2>
							<p
								className={'text-muted'}>
								<FontAwesomeIcon
									icon={faCheck}
									className={'mr-2'}
								/>
								{`${email} is successfully verified, Please click `}<Link to={`/Signin/${email}`}>{'here'}</Link>{' to Signin.'}
							</p>
						</div>
					</div>
				</div>
			);
		}
		return(
			<div
				className={'container'}>
				<div
					className={'row'}>
					<div
						className={'col-md-8 offset-md-2 text-center'}>
						<h2	
							className={'mb-0'}>
							{'Something is wrong ..'}
						</h2>
						<p
							className={'text-muted'}>
							{'Seems like you are lost! Please click '}<Link to={`${user ? '/' : '/Signin'}`}>{'here'}</Link>{' to get back on the app.'}
						</p>
					</div>
				</div>
			</div>
		);
	};
};

export default EmailVerification;