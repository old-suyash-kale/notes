import $ from 'jquery';
import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ToastContainer } from 'react-toastify';

import store from '../store';
import history from '../history';

import Header from './Common/Header';
import Footer from './Common/Footer';
import PrivateRoute from "./PrivateRoute";
import Signin from './Signin/';
import Signup from './Signup/';
import Dashboard from './Dashboard/';
import EmailVerification from './EmailVerification/';
import Error from './Error/';
import NoteShared from './NoteShared/';

class Routes extends Component {
	render() {
		let { user, theme } = this.props,
			{ bg, border, text } = theme;
		$('body').css({
			'min-height': window.innerHeight + 'px'
		});
		return(
			<ConnectedRouter
				store={store}
				history={history}>
				<div
					className={'app-root'}>
					<Header user={user} theme={theme} />
					<div
						className={'app-route note-margin'}>
						<Switch>
							<PrivateRoute
								component={Dashboard}
								theme={theme}
								user={user}
								exact={true}
								path={'/'}
							/>
							<Route
								render={(props)=> (<EmailVerification {...props} theme={theme} user={user} />)}
								theme={theme}
								exact={true}
								path={'/Email-Verification/:token'}
							/>
							<Route
								render={(props)=> (<EmailVerification {...props} theme={theme} user={user} />)}
								exact={true}
								path={'/Email-Verification'}
							/>
							<Route
								render={(props)=> (<Signin {...props} theme={theme} />)}
								exact={true}
								path={"/Signin/:email"}
							/>
							<Route
								render={(props)=> (<Signin {...props} theme={theme} />)}
								exact={true}
								path={"/Signin"}
							/>
							<Route
								render={(props)=> (<Signup {...props} theme={theme} />)}
								exact={true}
								path={"/Signup"}
							/>
							<Route
								render={(props)=> (<Error {...props} theme={theme} />)}
								exact={true}
								path={"/Error"}
							/>
							<Route
								render={(props)=> (<Error {...props} theme={theme} />)}
								exact={true}
								path={"/Error/:message"}
							/>
							<Route
								render={(props)=> (<NoteShared {...props} theme={theme} />)}
								exact={true}
								path={"/Note/:note"}
							/>
						</Switch>
					</div>
					<Footer user={user} theme={theme} />
					<ToastContainer
						toastClassName={`toast-container bg-${bg} text-${text} border border-${border}`}
						position={"bottom-center"}
						autoClose={3000}
						hideProgressBar
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnVisibilityChange={false}
						draggable={false}
						pauseOnHover
					/>
				</div>
			</ConnectedRouter>
		);
	};
};

export default connect(state => {
	return {
		user: state.user,
		theme: state.theme
	};
})(Routes);