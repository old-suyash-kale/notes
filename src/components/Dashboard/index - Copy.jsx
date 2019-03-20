import React, { Component } from 'react';

import Add from './Add';
import Notes from './Notes';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blur: false
		};
	};
	onBlurFilter(blur) {
		this.setState({ blur });
	};
	render() {
		const { theme } = this.props,
			{ bg, border } = theme,
			{ blur } = this.state;
		let notes = [
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment and Special title treatment',
				description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
			},
			{
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
			},
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment and Special title treatment',
				description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
			},
			{
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: 'With supporting text below as a natural lead-in to additional content.'
			},
			{
				title: 'Special title treatment',
				description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
			}
		];
		return(
			<div
				className={'container-fluid'}>
				<div
					className={'row'}>

					<div className={`apply-blur-filter ${blur || 'd-none'} bg-${bg}`}></div>

					<Add
						theme={theme}
						onBlurFilter={this.onBlurFilter.bind(this)}
					/>

					<div
						className={'col-md-10  offset-md-1'}>
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