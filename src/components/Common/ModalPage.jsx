import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

let theme = {
	bg: 'dark',
	border: 'dark',
	text: 'white'
};

class ModalPage extends Component {
	render() {
		let { props } = this,
			{ Header, Footer, children, isOpen, toggle } = props,
			{ bg, text } = theme;
		return(
			<Modal
				backdrop={false}
				toggle={toggle}
				className={`modal-page`}
				isOpen={isOpen}>
				<ModalHeader
					className={`bg-${bg} text-${text} d-block`}>
					<FontAwesomeIcon
						onClick={toggle}
						icon={faTimes}
						className={'cursor-pointer scale-hover-l mr-3'}
					/>
					{Header}
				</ModalHeader>
				<ModalBody>
					{children}
				</ModalBody>
				{Footer && <ModalFooter>{Footer}</ModalFooter>}
			</Modal>
		);
	};
};

export default ModalPage;


class Card extends Component {
	render() {
		let { className, src, children } = this.props,
			{ bg, border } = theme;
		return(
			<div
				className={className + ' know-more-card'}>
				<div
					className={`media pt-2 pr-3 pb-2 pl-2 border border-${border}`}>
					<img
						src={src}
						alt={''}
						className={`img-thumbnail bg-${bg} border-${border} rounded-circle align-self-center mr-3`}
					/>
					<div
						className={'media-body mt-4 mb-4'}>
						{children}
					</div>
				</div>
			</div>
		);
	};
};

export {
	Card
};