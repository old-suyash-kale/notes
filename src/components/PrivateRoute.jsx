import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, user, theme, path }) => {
	return(
		<Route
			path={path}
			render={(props) => user ?
				user.email_verified ?
					<Component
						{...props}
						user={user}
						theme={theme}
					/>
				:
					<Redirect
						to={{pathname: "/Email-Verification", state: {from: props.location}}}
					/>
			:
				<Redirect
					to={{pathname: "/Signin", state: {from: props.location}}}
				/>
			}
		/>
	);
};

export default PrivateRoute