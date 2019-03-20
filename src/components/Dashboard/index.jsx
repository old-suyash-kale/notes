import React, { Component } from 'react';

import { oNotes } from '../../services/Notes';

import Progress from '../Common/Progress';
import Blur from '../Common/Blur';
import Add from './Add';
import Notes from './Notes';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blur: false,
			progress: false,
			notes: []
		};
	};
	componentDidMount() {
		this.get();
		document.title = 'Notes - Dashboard';
	};
	onBlurFilter(blur, eObj) {
		if (eObj) {
			if (eObj.key === 'get') {
				this.get();
			}
		}
		this.setState({ blur });
	};
	get() {
		this.setState({ progress: true });
		oNotes.get()
		.then(({ d })=> {
			this.setState({
				progress: false,
				notes: d,
				blur: false
			});
		},(err)=> {
			this.setState({ progress: false });
			debugger;
		});
	};
	render() {
		const { theme } = this.props,
			{ blur, progress, notes } = this.state;
		return(
			<div
				className={'container-fluid'}>
				<div
					className={'row'}>

					<Blur blur={blur} />

					<Add
						theme={theme}
						onBlurFilter={this.onBlurFilter.bind(this)}
					/>

					<div
						className={'col-md-10  offset-md-1 position-relative'}>
						<Progress progress={progress} />
						<Notes
							notes={notes}
							theme={theme}
							onBlurFilter={this.onBlurFilter.bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	};
};

export default Dashboard;