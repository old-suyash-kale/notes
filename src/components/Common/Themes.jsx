import React, { Component } from 'react';
import { connect } from 'react-redux';

import themes from '../../themes';
import { setTheme } from '../../actions/theme/index';

import Tooltip from '../Common/Tooltip';

class Themes extends Component {
	onChangeTheme(iTheme) {
		this.props.setTheme(iTheme);
	};
	render() {
		let { theme } = this.props,
			{ bg, border, text } = theme;
		return(
			<div
				className={'btn-group'}>
				<button
					id={'button-themes'}
					className={`btn btn-${bg} text-${text} dropdown-toggle rounded-0 btn-theme ripple`}
					data-toggle={'dropdown'}
					type={'button'}>
					<div
						className={`border-${border} bg-${bg} theme-circle`}>
					</div>
					{'Theme'}
					<Tooltip
						placement={'left'}
						target={'button-themes'}
						reverse>
						{'Change Theme'}
					</Tooltip>
				</button>
				<div
					className={'dropdown-menu dropdown-menu-right rounded-0 p-0'}>
					{themes.map((iTheme, k)=>
						<button
							key={k}
							onClick={this.onChangeTheme.bind(this, iTheme)}
							className={`btn btn-${iTheme.bg} text-${iTheme.text} btn-block rounded-0 m-0 btn-theme text-left ripple`}>
							<div
								className={`border-${iTheme.border} bg-${iTheme.bg} theme-circle`}>
							</div>
							{iTheme.title}
						</button>
					)}
				</div>
			</div>
		);
	};
};

export default connect((state)=> {
	return {
		theme: state.theme
	}
}, {
	setTheme: setTheme
})(Themes);