import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setProperty } from '../../utils/lsHelper';
import { setUser } from '../../actions/user/index';

class Error extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: this.props.match.params.message || 'Seems like there is some problem, Please try again later!',
			email: props.user && props.user.email ? props.user.email : ''
		};
	};
	componentDidMount() {
		setProperty('remember', false);
		this.props.setUser(false);
		document.title = 'Notes - Error';
	};
	render() {
		let { message, email } = this.state;
		return(
			<div
				className={'container'}>
				<div
					className={'row'}>
					<div
						className={'col-md-8 offset-md-2 text-center'}>
						<h2	
							className={'mb-0'}>
							{message}
						</h2>
						<p
							className={'text-muted text-center'}>
							<Link to={`/Signin/${email}`}>{'Click here to Signin again.'}</Link>
						</p>
					</div>
				</div>
			</div>
		);
	};
};

export default connect((state)=> {
	return {
		user: state.user
	}
}, {
	setUser: setUser
})(Error);