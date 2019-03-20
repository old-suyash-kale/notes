import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faClock, faBookmark as faBookmarkRegular } from "@fortawesome/fontawesome-free-regular";
import { faExpand, faBookmark as faBookmarkSolid, faSync, faTimesCircle, faLink } from "@fortawesome/fontawesome-free-solid";
import { toast } from 'react-toastify';

import { oNotes } from '../../services/Notes';
import { dateToLocal, dateTimeNow, copyToClipboard } from '../../utils/index';

import Progress  from '../Common/Progress';
import Tooltip from '../Common/Tooltip';

class Note extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bEdit: false,
			bExpanded: false,
			bPin: props.note.pin,
			bUpdating: false,
			bDanger: false,
			bFreez: false,
			oForm: {
				title: props.note.title,
				description: props.note.description,
				dt: props.note.dt
			}
		};

		this.updateTitle = debounce(this.updateTitle.bind(this), 900);
		this.updateDescription = debounce(this.updateDescription.bind(this), 900);
	};
	componentDidMount() {
		const { oForm } = this.state,
			{ contentEditableTitle, contentEditableDescription } = this.refs;
			ReactDOM.findDOMNode(contentEditableTitle).innerText = oForm.title;
			ReactDOM.findDOMNode(contentEditableDescription).innerText = oForm.description;
	};
	componentDidUpdate(prevProps) {
		let { props } = this;
		if (prevProps.note.note_id !== props.note.note_id) {
			this.setState({
				bEdit: false,
				bExpanded: false,
				bPin: props.note.pin,
				bUpdating: false,
				bDanger: false,
				bFreez: false,
				oForm: {
					title: props.note.title,
					description: props.note.description,
					dt: props.note.dt
				}
			},()=> {
				this.componentDidMount();
			});
		}
	};
	componentWillUnmount() {
		let services = ['update_title', 'update_description'];
		for (let i in services) {
			let service = services[i];
			if (this[service] && this[service].abort) {
				this[service].abort();
			}
		};
	};
	onChangeExpanded(bExpanded) {
		this.setState({ bExpanded });
	};
	onMouseEnter() {
		const { onMouseEnter } = this.props,
			{ bFreez } = this.state;
		if (!bFreez) {
			this.setState({
				bEdit: true
			},()=> {
				const { contentEditableDescription } = this.refs;
				if (contentEditableDescription) {
					setTimeout(()=> {
						ReactDOM.findDOMNode(contentEditableDescription).focus();
					}, 100);
				}
				if (onMouseEnter) {
					onMouseEnter();
				}
			});
		}
	};
	onMouseLeaveCheck(eObj) {
		return new Promise((resolve)=> {
			let { oForm } = this.state,
				{ note } = this.props;
			if (!oForm.title && !oForm.description) {
				this.setState({
					bUpdating: true,
					bDanger: true,
					bFreez: true
				});
				oNotes.trash({ note_id: note.note_id })
				.then(()=> {
					if (!eObj) {
						eObj = {};
					}
					eObj.key = 'get';
					this.setState({
						bUpdating: false,
						bDanger: false,
						bFreez: false,
						bExpanded: false
					});
					resolve(eObj);
				},()=> {
					resolve(eObj);
				});
			} else {
				resolve(eObj);
			}
		});
	};
	onMouseLeave(eObj) {
		const { onMouseLeave } = this.props,
			{ bFreez, bExpanded } = this.state;
		if (!bFreez && !bExpanded) {
			this.setState({
				bEdit: false
			},()=> {
				this.onMouseLeaveCheck(eObj)
				.then((ceObj)=> {
					if (onMouseLeave) {
						onMouseLeave(ceObj);
					}
				});
			});
		}
	};
	updateTitle(o) {
        if (this.update_title && this.update_title.abort) {
            this.update_title.abort();
		}
		this.setState({ bUpdating: true });
		this.update_title = oNotes
		.updateTitle(o)
		.then(()=> {
			let { oForm } = this.state;
			oForm.dt = dateTimeNow();
			this.setState({ bUpdating: false, oForm });
		},()=> {
			this.setState({ bUpdating: false });
		});
	};
	updateDescription(o) {
        if (this.update_description && this.update_description.abort) {
            this.update_description.abort();
		}
		this.setState({ bUpdating: true });
		this.update_description = oNotes
		.updateDescription(o)
		.then(()=> {
			let { oForm } = this.state;
			oForm.dt = dateTimeNow();
			this.setState({ bUpdating: false, oForm });
		},()=> {
			this.setState({ bUpdating: false });
		});
	};
	onInputChange(t, { target }) {
		let innerText = target.innerText,
			{ note } = this.props,
			{ oForm } = this.state,
			o = { note_id: note.note_id };
		o[t] = innerText;
		if (t === 'title') {
			oForm.title = innerText;
			this.updateTitle(o);
		} else if (t === 'description') {
			oForm.description = innerText;
			this.updateDescription(o);
		}
		this.setState({ oForm });
	};
	onTrash() {
		let { oForm } = this.state;
		oForm.title = '';
		oForm.description = '';
		this.onMouseLeave();
	};
	onShare() {
		let { note } = this.props;
		oNotes.share({ note_id: note.note_id })
		.then(({ d })=> {
			copyToClipboard(`${window.location.origin}/#/Note/${d}`);
			toast('Note url copyed to clipboard successfully!', {
				type: toast.TYPE.SUCCESS
			})
		});
	};
	onBookmark() {
		let { note } = this.props,
			{ note_id } = note,
			{ bPin } = this.state,
			pin = bPin === 1 ? 0 : 1;
		oNotes.pin({ note_id, pin })
		.then(()=> {
			this.setState({
				bPin: pin
			},()=> {
				this.onMouseLeave({ key: 'get' });
			});
		});
	};
	render() {
		const { note, theme } = this.props,
			{ bg, text } = theme,
			{ oForm, bEdit, bExpanded, bPin, bUpdating, bDanger } = this.state,
			{ dt, title } = oForm,
			dObj = dateToLocal(dt);
		return(
			<div
				onMouseEnter={()=> {
					this.onMouseEnter();
				}}
				onMouseLeave={()=> {
					this.onMouseLeave();
				}}
				className={`${bExpanded ? 'col-md-10 note-expanded' : 'col-md-4'} note ${bEdit ? 'note-edit' : ''}`}>
				<div
					className={`card w-100`}>
					<Progress progress={bUpdating} danger={bDanger} />
					<div
						className={`card-body`}>
						<div
							className={'floating-icons'}>
							<FontAwesomeIcon
								className={`${bPin ? `` : 'd-none'}`}
								icon={faBookmarkSolid}
							/>
						</div>
						<div
							onInput={this.onInputChange.bind(this, 'title')}
							ref={'contentEditableTitle'}
							contentEditable={bEdit ? 'true' : 'false'}
							placeholder={'Note Title ...'}
							className={`card-title ${((title && title.length) || bEdit) ? '' : 'd-none'}`}>
						</div>
						<div
							onInput={this.onInputChange.bind(this, 'description')}
							ref={'contentEditableDescription'}
							placeholder={'Note Description ...'}
							contentEditable={bEdit ? 'true' : 'false'}
							className={`card-text`}>
						</div>
					</div>
					<div
						className={`card-footer bg-${bg} text-${text}`}>
						<small
							className={`float-left text-${text}`}>
							<FontAwesomeIcon
								className={`${bUpdating ? 'mr-2' : 'd-none'}`}
								icon={faSync}
								spin
							/>
							{bUpdating ? null :
								<span
									id={`span-time-${note.note_id}`}>
									<FontAwesomeIcon
										className={'mr-1'}
										icon={faClock}
									/>
									{dObj.small}
									<Tooltip
										placement={'right'}
										target={`span-time-${note.note_id}`}
										reverse>
										{dObj.long}
									</Tooltip>
								</span>
							}
						</small>
						<button
							id={`button-expand-${note.note_id}`}
							onClick={this.onChangeExpanded.bind(this, !bExpanded)}
							className={`btn btn-sm rounded-circle ripple scale-hover-l float-right shadow-sm`}>
							<FontAwesomeIcon
								className={`text-${text}`}
								icon={bExpanded ? faTimesCircle : faExpand}
							/>
							<Tooltip
								placement={'left'}
								target={`button-expand-${note.note_id}`}
								reverse>
								{bExpanded ? 'Close' : 'Expand'}
							</Tooltip>
						</button>
						<button
							onClick={this.onTrash.bind(this)}
							id={`button-trash-${note.note_id}`}
							className={`btn btn-sm rounded-circle ripple scale-hover-l float-right shadow-sm mr-2`}>
							<FontAwesomeIcon
								className={'text-danger'}
								icon={faTrashAlt}
							/>
							<Tooltip
								placement={'left'}
								target={`button-trash-${note.note_id}`}
								danger>
								{'Trash Note'}
							</Tooltip>
						</button>
						<button
							onClick={this.onBookmark.bind(this)}
							id={`button-pin-${note.note_id}`}
							className={`btn btn-sm rounded-circle ripple scale-hover-l float-right shadow-sm mr-2 `}>
							<FontAwesomeIcon
								icon={bPin ? faBookmarkSolid : faBookmarkRegular}
							/>
							<Tooltip
								placement={'left'}
								target={`button-pin-${note.note_id}`}
								reverse>
								{bPin ? 'Remove Bookmark' : 'Bookmark'}
							</Tooltip>
						</button>
						<button
							onClick={this.onShare.bind(this)}
							id={`button-share-${note.note_id}`}
							className={`btn btn-sm rounded-circle ripple scale-hover-l float-right shadow-sm mr-2 `}>
							<FontAwesomeIcon
								className={`text-${text}`}
								icon={faLink}
							/>
							<Tooltip
								placement={'left'}
								target={`button-share-${note.note_id}`}
								reverse>
								{'Link to share'}
							</Tooltip>
						</button>
					</div>
				</div>
			</div>
		);
	};
};

export default Note;