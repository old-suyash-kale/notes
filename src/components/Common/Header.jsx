import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUserPlus, faSignOutAlt, faCog } from "@fortawesome/fontawesome-free-solid";

import { setUser } from '../../actions/user/index';
import Themes from '../Common/Themes';

require('bootstrap');
class Header extends Component {
	onSignout(e) {
		this.props.setUser(false);
	};
	render() {
		let { user, theme } = this.props,
			{ bg, text } = theme;
		return(
			<nav
				className={`navbar navbar-expand-lg navbar-${bg} app-header bg-${bg} border-bottom note-margin shadow-sm`}>
				<Link
					to={'/'}
					className={`navbar-brand text-${text}`}>
					<span
						className={'brand-n'}>
						{'N'}
					</span>
					{'otes'}
				</Link>
				<div
					className={'collapse navbar-collapse'}>

					<ul
						className={'navbar-nav mr-auto'}>
						{user ? null :
							<React.Fragment>
								<li
									className={'nav-item'}>
									<Link
										to={'/Signin'}
										className={`nav-link ripple text-${text}`}>
										<FontAwesomeIcon
											icon={faSignInAlt}
											className={'mr-2'}
										/>
										{'Signin'}
									</Link>
								</li>
								<li
									className={'nav-item'}>
									<Link
										to={'/Signup'}
										className={`nav-link ripple text-${text}`}>
										<FontAwesomeIcon
											icon={faUserPlus}
											className={'mr-2'}
										/>
										{'Signup'}
									</Link>
								</li>
							</React.Fragment>
						}
					</ul>

					<ul
						className={'navbar-nav'}>
						<li>
							<Themes />
						</li>
						{user ?
							<li>
								<div
									className={'btn-group'}>
									<button
										className={`btn btn-${bg} text-${text} dropdown-toggle rounded-0 ripple`}
										data-toggle={'dropdown'}
										type={'button'}>
										<FontAwesomeIcon
											icon={faCog}
										/>
									</button>
									<div	
										className={'dropdown-menu dropdown-menu-right rounded-0 p-0'}>
										<button
											type={'button'}
											onClick={this.onSignout.bind(this)}
											className={'btn btn-block dropdown-item'}>
											<FontAwesomeIcon
												icon={faSignOutAlt}
												className={'mr-2'}
											/>
											{'Signout'}
										</button>
									</div>
								</div>
							</li>
						: null}
					</ul>
				</div>
			</nav>
		);
	};
};

export default connect(null, {
	setUser: setUser
})(Header);