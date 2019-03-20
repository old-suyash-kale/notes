import React, { Component } from 'react';

import { oNotes } from '../../services/Notes';
import { dateTimeNow } from '../../utils/index';

import Progress from '../Common/Progress';
import Note from './Note';

class Add extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: null,
			blur: false
		};
	};
	onAddNote() {
		let { onBlurFilter } = this.props,
			title = '',
			description = '';
		this.setState({ blur: true });
		oNotes.add({ title, description })
		.then(({d})=> {
			this.setState({
				note: {
					note_id: d.note_id,
					title,
					description,
					dt: dateTimeNow()
				},
				blur: false
			},()=> {
				this.Note.onMouseEnter();
				if (onBlurFilter) {
					onBlurFilter(true);
				}
				this.setState({ blur: false });
			});
		});
	};
	onMouseLeave(eObj) {
		const { onBlurFilter } = this.props;
		this.setState({
			note: null
		});
		if (onBlurFilter) {
			if (!eObj || !eObj.key) {
				eObj = {
					key: 'get'
				};
			}
			onBlurFilter(false, eObj);
		}
	};
	render() {
		const { theme } = this.props,
			{ border } = theme,
			{ note, blur } = this.state;
		return(
			<div
				style={{
					minHeight: '58px'
				}}
				className={'col-md-10 offset-md-1 note-margin'}>
				<div
					className={'row'}>
					<div className={'col-md-4'}></div>
						{note ?
							<Note
								note={note}
								theme={theme}
								onMouseLeave={this.onMouseLeave.bind(this)}
								ref={instance => { this.Note = instance; }}
							/>
						:
							<div
								style={{
									minHeight: '56px'
								}}
								onClick={this.onAddNote.bind(this)}
								className={`col-md-4 cursor-pointer scale-hover-negative position-relative`}>
								<Progress progress={blur} />
								<div
									className={`card border-${border} rounded-0 shadow`}>
									<div
										className={'card-body p-3 font-weight-bold  on-hover-parent'}>
										<div
										className={'row'}>
											<div
												className={'col-md-9 pr-0'}>
												{'Take a Note ...'}
											</div>
											<div
												className={'col-md-3 pl-0 text-muted text-right on-hover'}>
												{blur ? 'Wait!' : 'Click!'}
											</div>
										</div>
									</div>
								</div>
							</div>
						}
					<div className={'col-md-4'}></div>
				</div>
			</div>
		);
	};
};

export default Add;