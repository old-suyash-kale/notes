import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/fontawesome-free-regular";
import { faCheck } from "@fortawesome/fontawesome-free-solid";

import { socket } from '../../sConfig';
import { oNotes } from '../../services/Notes';
import { dateToLocal } from '../../utils/index';

import Tooltip from '../Common/Tooltip';
import Progress from '../Common/Progress';

class NoteShared extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blur: false,
			d: {}
		};
	};
	componentDidMount() {
		this.get()
		.then(()=> {
			let { note_id } = this.state.d;
			socket.on(`update-title-${note_id}`,({ title, dt })=> {
				let { d } = this.state;
				d.dt = dt;
				d.title = title;
				this.setState({ d });
			});
			socket.on(`update-description-${note_id}`,({ description, dt })=> {
				let { d } = this.state;
				d.dt = dt;
				d.description = description;
				this.setState({ d });
			});
		});
		document.title = 'Notes - Shared';
	};
	get() {
		return new Promise((resolve, reject)=> {
			this.setState({ blur: true });
			oNotes.getShared(this.props.match.params.note)
			.then(({ d })=> {
				this.setState({
					d,
					blur: false
				});
				resolve();
			},()=> {
				reject();
			});
		});
	};
	componentDidUpdate() {
		let { title, description } = this.state.d,
			{ refTitle, refDescription } = this.refs;
		ReactDOM.findDOMNode(refTitle).innerText = title;
		ReactDOM.findDOMNode(refDescription).innerText = description;
	};
	render() {
		const { theme } = this.props,
			{ border } = theme,
			{ blur, d } = this.state,
			{ note_id, title, dt, fname, lname } = d,
			dObj = dateToLocal(dt);
		return(
			<div
				className={'container'}>
				<div
					className={'row'}>
					<div
						className={'col-md-8 offset-md-2 note note-full-height'}>
						<div
							className={`row mb-2`}>
							<div
								className={'col-md-6'}>
								<FontAwesomeIcon
									className={'mr-1 ml-2'}
									icon={faUser}
								/>
								{fname} {lname}
								<small
									className={'text-muted ml-2'}
									id={`span-time-${note_id}`}>
									<FontAwesomeIcon
										className={'mr-1'}
										icon={faClock}
									/>
									{dObj.small}
									<Tooltip
										placement={'right'}
										target={`span-time-${note_id}`}>
										{dObj.long}
									</Tooltip>
								</small>
							</div>
							<div
								className={'col-md-6 text-right'}>
								<small
									id={'small-realtime'}>
									<FontAwesomeIcon
										icon={faCheck}
										className={'mr-2'}
									/>
									{'Real time!'}
								</small>
								<Tooltip
									placement={'left'}
									target={`small-realtime`}>
									{'You are viewing Note in real time!'}
								</Tooltip>
								{/* <button
									id={`button-refresh`}
									onClick={this.get.bind(this)}
									disabled={blur}
									className={`btn btn-${bg} text-${text} btn-sm rounded-circle ripple scale-hover-l float-right shadow-sm mr-2`}>
									<FontAwesomeIcon
										icon={faSync}
										spin={blur}
									/>
								</button>
								<Tooltip
									placement={'left'}
									target={`button-refresh`}>
									{'Refresh'}
								</Tooltip> */}
							</div>
						</div>
						<Progress
							progress={blur}
						/>
						<div
							className={`card border-${border}`}>
							<div
								className={'card-body'}>
								<div
									ref={'refTitle'}
									className={`card-title ${(title && title.length ? '' : 'd-none')}`}>
								</div>
								<div
									ref={'refDescription'}
									className={'card-text'}>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	}
})(NoteShared);