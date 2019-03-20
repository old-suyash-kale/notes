import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faEnvelope, faTerminal } from "@fortawesome/fontawesome-free-solid";

import Tooltip from '../Common/Tooltip';
import ModalPage, { Card } from '../Common/ModalPage';

class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpenKnowMore: false
		};
	};
	toggleKnowMore() {
		let { isOpenKnowMore } = this.state;
		this.setState({
			isOpenKnowMore: !isOpenKnowMore
		});
	};
	render() {
		let { theme } = this.props,
		{ bg, text, border } = theme,
		{ isOpenKnowMore } = this.state;
		return(
			<div
				className={`container-fluid app-footer bg-${bg} text-${text} border-top border-${border}`}>
				<ModalPage
					isOpen={isOpenKnowMore}
					toggle={this.toggleKnowMore.bind(this)}
					Header={'Know about Notes!'}>
					<div
						className={'container-fluid'}>
						<div
							className={'row'}>

							<Card
								className={`col-md-8 offset-md-2`}
								src={'/img/suyashkale.png'}>
								<p className={'text-justify mb-2'}><strong>Notes App</strong> is a weekend project built by <a href={'http://suyashkale.com'} target={'_blank'}><strong>Suyash Kale</strong></a> for solving the problem of create/ editing multiple note at once with ease and pace, with simple, secure and real time sharing.</p>
								<p className={'text-justify mb-2'}>My weekdays are mostly occupied with challenges in UI Dev, therefore here I have challenged myself with everything else, like UX design, backend, security etc. with a hope to learn, improve and share skills.</p>
							</Card>

							<Card
								className={`col-md-5 offset-md-1 mt-3`}
								src={'/img/bootstrap.png'}>
								<p className={'text-justify mb-2'}><a href={'https://getbootstrap.com/'} target={'_blank'}><strong>Bootstrap</strong></a> remains my weapon of choice when it comes to UI design. Using its flexibility through <a href={'https://sass-lang.com/'} target={'_blank'}>Sass</a> have implement theme in 7 different colors.</p>
								<p className={'text-justify mb-2'}><a href={'https://reactstrap.github.io/'} target={'_blank'}>Reactstrap</a> also plays an important role when blending bootstrap with react. </p>
							</Card>

							<Card
								className={`col-md-5 offset-md-1 mt-3`}
								src={'/img/react.png'}>
								<p className={'text-justify mb-2'}>Keeping front-end simple and hight performance with <a href={'https://reactjs.org/'} target={'_blank'}><strong>React</strong></a>.</p>
								<p className={'text-justify mb-2'}>Trusting <a href={'https://redux.js.org/'} target={'_blank'}>Redux</a> with state management, and adding super-powers with <a href={'https://www.npmjs.com/package/redux-promise'} target={'_blank'}>promise</a> and <a href={'https://www.npmjs.com/package/redux-thunk'} target={'_blank'}>thunk</a> middleware.</p>
							</Card>

							<Card
								className={`col-md-5 offset-md-1 mt-3`}
								src={'/img/nodejs.png'}>
								<p className={'text-justify mb-2'}>Running on <a href={'https://nodejs.org/'} target={'_blank'}><strong>Node</strong></a> with helping hand from <a href={'https://expressjs.com/'} target={'_blank'}>express</a> and <a href={'https://socket.io/'} target={'_blank'}>socket.io</a>.</p>
								<p className={'text-justify mb-2'}>Rest APIs secured with jwt and hashing. Adding WebSockets for real time and two way communication.</p>
							</Card>

							<Card
								className={`col-md-5 offset-md-1 mt-3`}
								src={'/img/heroku.png'}>
								<p className={'text-justify mb-2'}>Deploying, managing and scaling on <a href={'https://www.heroku.com/'} target={'_blank'}><strong>Heroku</strong></a> with enabling automatic deployment from Git, which enabled me to keep focus on development.</p>
								<p className={'text-justify mb-2'}>Heroku added infrastructure and enabled us to deploy this app without any cost.</p>
							</Card>

						</div>
					</div>
				</ModalPage>
				<div
					className={'row p-2'}>
					<small
						className={'col-md-6'}>
						{`Copyright ${(new Date()).getFullYear()}. All Rights Reserved`}
					</small>
					<small
						className={'col-md-6 text-right'}>
						<span
							className={'cursor-pointer'}
							id={'app-footer-know-more'}
							onClick={this.toggleKnowMore.bind(this)}>
							<FontAwesomeIcon
								className={'mr-2'}
								icon={faQuestionCircle}
							/>
							{'Know more'}
						</span>
						<Tooltip
							placement={'left'}
							target={'app-footer-know-more'}
							reverse>
							{'Know more about Notes!'}
						</Tooltip>
						<span className={'ml-3 mr-3'}>|</span>
						<a
							className={`text-${text}`}
							href={'mailto:suyash@notes.suyashkale.com'}>
							<FontAwesomeIcon
								icon={faEnvelope}
								className={'mr-2'}
							/>
							Contact
						</a>
						<span className={'ml-3 mr-3'}>|</span>
						<a
							className={`text-${text}`}
							target={'blank'}
							href={'http://suyashkale.com'}>
							<FontAwesomeIcon
								icon={faTerminal}
								className={'mr-2'}
							/>
							{`Created with `}<s>{'Love'}</s>{' Code by Suyash Kale;'}
						</a>
					</small>
				</div>
			</div>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	};
})(Footer);