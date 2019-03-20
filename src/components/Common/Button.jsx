import React, { Component } from 'react';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/fontawesome-free-solid";

import { removeAdditionalProps } from '../../utils/index';

class Button extends Component {
	render() {
		let { props } = this,
			ButtonProps = removeAdditionalProps(props, ['icon']);
		return(
			<button
				{...ButtonProps}>
				{props.icon &&
					<FontAwesomeIcon
						spin={props.disabled ? true : false}
						icon={props.disabled ? faSync : props.icon}
						className={'mr-2'}
					/>
				}
				{props.children}
			</button>
		);
	};
};

Button.propTypes = {
	icon: PropTypes.any
};

Button.defaultProps = {
};

export default Button;