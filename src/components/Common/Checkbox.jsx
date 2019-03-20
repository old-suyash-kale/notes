import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCheckCircle } from "@fortawesome/fontawesome-free-regular";

// class Checkbox extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			icon: this.getIcon(props.status)
// 		};
// 	};
// 	componentDidUpdate(prevProps) {
// 		const { status } = this.props;
// 		if (prevProps.status !== status) {
// 			this.setState({
// 				icon: this.getIcon(status)
// 			});
// 		}
// 	};
// 	getIcon(status) {
// 		return status ? faCheckCircle : faCircle;
// 	};
// 	onMouseEnter() {
// 		this.setState({
// 			icon: this.getIcon(!this.props.status)
// 		});
// 	};
// 	onMouseLeave() {
// 		this.setState({
// 			icon: this.getIcon(this.props.status)
// 		});
// 	};
// 	render() {
// 		let { icon } = this.state;
// 		return(
// 			<div
// 				onClick={this.props.onClick}
// 				className={'d-inline-block cursor-pointer pl-3 pr-3 scale-hover-l'}
// 				onMouseEnter={this.onMouseEnter.bind(this)}
// 				onMouseLeave={this.onMouseLeave.bind(this)}>
// 				<FontAwesomeIcon
// 					icon={icon}
// 				/>
// 			</div>
// 		);
// 	};
// };

class Checkbox extends Component {
	render() {
		let { status } = this.props;
		return(
			<div
				onClick={this.props.onClick}
				className={'d-inline-block cursor-pointer pl-3 pr-3 scale-hover-l component-checkbox'}>
				<FontAwesomeIcon
					icon={status ? faCheckCircle : faCircle}
				/>
			</div>
		);
	};
};

export default Checkbox;