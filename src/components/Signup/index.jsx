import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaperPlane } from "@fortawesome/fontawesome-free-solid";


import { oUser } from '../../services/User';
import { oFormChange } from '../../utils/index';
import { setUser } from '../../actions/user/index';

import Button from '../Common/Button';
import Progress from '../Common/Progress';

class Signup extends Component {
	constructor(props) {
		super(props);
		this.oFormChange = oFormChange.bind(this);
		this.state = {
			blur: false,
			oForm: {
				fname: {
					value: '',
					onChange: (e)=> {
						this.oFormChange('oForm', 'fname', e.target.value);
					}
				},
				lname: {
					value: '',
					onChange: (e)=> {
						this.oFormChange('oForm', 'lname', e.target.value);
					}
				},
				email: {
					value: '',
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
				cPassword: {
					value: '',
					onChange: (e)=> {
						this.oFormChange('oForm', 'cPassword', e.target.value);
					}
				}
			}
		};
	};
	componentDidMount() {
		document.title = 'Notes - Signup';
	};
	onSignup(e) {
		e.preventDefault();
		const { oForm }  = this.state;
		if (oForm.password.value === oForm.cPassword.value) {
			this.setState({ blur: true });
			oUser.signup({
				fname: oForm.fname.value,
				lname: oForm.lname.value,
				email: oForm.email.value,
				password: oForm.password.value
			})
			.then(({d, s})=> {
				this.setState({ blur: false });
				this.props.setUser(d);
				this.props.history.push('/');
			},(err)=> {
				this.setState({ blur: false });
				debugger;
			});
		} else {
			toast.warn(`Password and Confirm Password doesn't match!`);
		}
	};
	render() {
		const { theme } = this.props,
			{ bg, border, text } = theme,
			{ oForm, blur } = this.state;
		return(
			<div
				className={'container'}>
				<div
					className={'row'}>
					<div
						className={'col-md-4 offset-md-4 position-relative'}>
						<Progress progress={blur} />
						<div
							className={`card bg-${bg} text-${text} border border-${border} rounded-0 shadow`}>
							<form
								onSubmit={this.onSignup.bind(this)}>
								<div className={`card-header bg-${bg} border border-${border}`}>
									<FontAwesomeIcon
										icon={faUserPlus}
										className={'mr-2'}
									/>
									{'Signup'}
								</div>
								<div
									className="card-body bg-white text-dark p-3">

									<div
										className={'row'}>
										<div
											className={'col-md-6 pr-2'}>
											<div
												className={'form-group'}>
												<input
													{...oForm.fname}
													disabled={blur}
													autoComplete={'off'}
													type={'text'}
													className={`form-control rounded-0 border-${border} shadow-sm scale-focus`}
													placeholder={'First Name ..'} />
											</div>
										</div>
										<div
											className={'col-md-6 pl-2'}>
											<div
												className={'form-group'}>
												<input
													{...oForm.lname}
													disabled={blur}
													autoComplete={'off'}
													type={'text'}
													className={`form-control rounded-0 border-${border} shadow-sm scale-focus`}
													placeholder={'Last Name ..'} />
											</div>
										</div>
									</div>

									<div
										className={'form-group'}>
										<input
											{...oForm.email}
											disabled={blur}
											autoComplete={'off'}
											type={'email'}
											className={`form-control rounded-0 border-${border} shadow-sm scale-focus`}
											placeholder={'Email address ..'} />
											{oForm.email.value.length < 2 ?
												<small
													className={'form-text text-muted ml-1'}>
													{'We promise not to share/ span your email.'}
												</small>
											:
												<small
													className={'form-text text-muted ml-1'}>
													{'Will be sending verification link on your email.'}
												</small>
											}
									</div>
									<div
										className={'form-group'}>
										<input
											{...oForm.password}
											disabled={blur}
											autoComplete={'off'}
											type={'password'}
											className={`form-control rounded-0 border-${border} shadow-sm scale-focus`}
											placeholder={'Password ..'} />
									</div>
									<div
										className={`form-group ${oForm.password.value.length > 2 ? '' : 'd-none'}`}>
										<input
											{...oForm.cPassword}
											disabled={blur}
											autoComplete={'off'}
											type={'password'}
											className={`form-control rounded-0 border-${border} shadow-sm scale-focus`}
											placeholder={'Confirm Password ..'} />
									</div>

									<Button
										disabled={blur}
										type={'submit'}
										icon={faPaperPlane}
										className={`btn btn-${bg} rounded-0 border shadow-sm scale-hover-negative border-${border} text-${text} ripple`}>
										{'Get in!'}
									</Button>
									{blur ?
										<small
											className={'text-muted ml-2'}>
											{'It may take some time!'}
										</small>
									: null}
								</div>
							</form>
						</div>
						<div
							className={'text-center mt-3'}>
							<Link
								to={'/Signin'}
								className={'text-dark'}>
								{'Already have an Account? Sign in here!'}
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
})(Signup);