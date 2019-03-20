import React, { Component } from 'react';
import { connect } from 'react-redux';

class Blur extends Component {
	render() {
		let { blur, theme, full } = this.props,
			{ bg } = theme;
		return(
			<div className={`apply-blur-filter ${blur || 'd-none'} bg-${bg} ${!full || 'full'}`}></div>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	}
})(Blur);