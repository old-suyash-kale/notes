import React, { Component } from 'react';

import Note from './Note';

class Notes extends Component {
	onMouseEnter() {
		const { onBlurFilter } = this.props;
		if (onBlurFilter) {
			onBlurFilter(true);
		}
	};
	onMouseLeave(eObj) {
		const { onBlurFilter } = this.props;
		if (onBlurFilter) {
			onBlurFilter(false, eObj);
		}
	};
	render() {
		const { notes, theme } = this.props;
		return(
			<div
				className={'row'}>
				{notes.map((note, k)=> 
					<Note
						key={k}
						note={note}
						theme={theme}
						onMouseEnter={this.onMouseEnter.bind(this)}
						onMouseLeave={this.onMouseLeave.bind(this)}
					/>
				)}
			</div>
		);
	};
};

export default Notes;