import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faPaperPlane, faEye, faEyeSlash } from "@fortawesome/fontawesome-free-solid";


import { oUser } from '../../services/User';
import { oFormChange } from '../../utils/index';
import { setUser } from '../../actions/user/index';

import Button from '../Common/Button';
import Progress from '../Common/Progress';
import Tooltip from '../Common/Tooltip';

class Signin extends Component {
	constructor(props) {
		super(props);
		this.oFormChange = oFormChange.bind(this);
		this.state = {
			blur: false,
			oForm: {
				email: {
					value: this.props.match.params.email || '',
					onChange: (e)=> {
						this.oFormChange('oForm', 'email', e.target.value);
					}
				},
				password: {
					value: '',
					onChange: (e)=> {
						this.oFormChange('oForm', 'password', e.target.value);
					}
				},
				remember: true
			},
			viewPassword: false
		};
	};
	componentDidMount() {
		document.title = 'Notes - Signin';
	};
	onSignin(e) {
		e.preventDefault();
		const { oForm }  = this.state;
		this.setState({ blur: true });
		oUser.signin({
			email: oForm.email.value,
			password: oForm.password.value
		})
		.then(({d, s})=> {
			this.setState({ blur: false });
			this.props.setUser(d, oForm.remember);
			this.props.history.push('/');
		}, (err)=> {
			this.setState({ blur: false });
			debugger;
		});
	};
	render() {
		const { theme } = this.props,
			{ bg, border, text } = theme,
			{ oForm, blur, viewPassword } = this.state;
		return(
			<div
				className={'container'}>
				<div
					className={'row'}>
					<div
						className={'col-md-4 offset-md-4'}>
						<Progress
							progress={blur}
						/>
						<div
							className={`card bg-${bg} text-${text} border border-${border} rounded-0 shadow`}>
							<form
								className={'position-relative'}
								onSubmit={this.onSignin.bind(this)}>
								<div className={`card-header rounded-0 bg-${bg} border border-${border}`}>
									<FontAwesomeIcon
										icon={faSignInAlt}
										className={'mr-2'}
									/>
									{'Signin'}
								</div>
								<div
									className={`card-body bg-white p-3`}>
									<div
										className={'form-group'}>
										<input
											{...oForm.email}
											disabled={blur}
											autoComplete={'off'}
											type={'email'}
											className={`form-control rounded-0 shadow-sm scale-focus border-${border}`}
											placeholder={'Email address ..'} />
									</div>
									<div
										className={'form-group form-group-has-icon'}>
										<input
											{...oForm.password}
											disabled={blur}
											autoComplete={'off'}
											type={viewPassword ? 'text' : 'password'}
											className={`form-control rounded-0 shadow-sm scale-focus border-${border}`}
											placeholder={'Password ..'} />
										<div
											className={'form-group-icons mt-2 mr-2'}>
											<FontAwesomeIcon
												id={'FontAwesomeIcon-view-password'}
												icon={viewPassword ? faEye : faEyeSlash}
												className={`text-dark cursor-pointer`}
												onClick={()=> {
													this.setState({viewPassword: !viewPassword});
												}}
											/>
											<Tooltip
												trigger={'click hover focus'}
												placement={'left'}
												target={'FontAwesomeIcon-view-password'}>
												{viewPassword ? 'Hide Password' : 'Show Password'}
											</Tooltip>
										</div>
									</div>
									<Button
										disabled={blur}
										type={'submit'}
										icon={faPaperPlane}
										className={`btn btn-${bg} rounded-0 border shadow-sm scale-hover-negative border-${border} text-${text} ripple`}>
										{'Get in!'}
									</Button>
									<div
										className={'custom-control custom-checkbox text-dark d-inline-block ml-3'}>
										<input
											type={'checkbox'}
											className={'custom-control-input'}
											id={'input-remember-me'}
											checked={oForm.remember}
											onChange={()=> {
												oForm.remember = !oForm.remember;
												this.setState({ oForm });
											}}
										/>
										<label
											className={'custom-control-label'}
											htmlFor={'input-remember-me'}>
											{'Remember me'}
										</label>
									</div>
								</div>
							</form>
						</div>
						<div
							className={'text-center mt-3'}>
							<Link
								to={'/Signup'}
								className={'text-dark'}>
								{`Don't have an Account yet? Sign Up here!`}
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	};
};

export default connect(null, {
	setUser: setUser
})(Signin);