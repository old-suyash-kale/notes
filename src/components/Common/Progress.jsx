import React, { Component } from 'react';
import { connect } from 'react-redux';

class Progress extends Component {
	render() {
		let { progress, theme, danger } = this.props,
			{ border } = theme;
		return(
			<div
				className={`progress progress-animation ${progress || 'opacity-1'}`}>
				<div
					className={`progress-bar ${progress ? `bg-${(danger ? 'danger' : border)}`: 'd-none'}`}
					role={'progressbar'}>
				</div>
			</div>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	}
})(Progress);