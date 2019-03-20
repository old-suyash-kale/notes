import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';

import { removeAdditionalProps } from '../../utils/index';

class Tooltip extends Component {
	render() {
		let { props } = this,
			{ children, theme, reverse, danger } = props,
			{ bg, text, border } = theme,
			innerClassName = `bg-${bg} text-${text} border-${border}`,
			UncontrolledTooltipProps = removeAdditionalProps(props, ['reverse', 'danger', 'theme']);
		if (reverse) {
			innerClassName = `bg-${text} text-${bg} border-${border}`;
		}
		if (danger) {
			innerClassName = `bg-danger text-white border-danger`;
		}
		return(
			<UncontrolledTooltip
				innerClassName={innerClassName}
				{...UncontrolledTooltipProps}
				hideArrow={true}>
				{children}
			</UncontrolledTooltip>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	};
})(Tooltip);