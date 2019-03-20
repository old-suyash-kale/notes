import { getProperty, setProperty } from '../../utils/lsHelper';
import themes from '../../themes';

let dTheme = getProperty('theme');
if (!dTheme) {
	dTheme = themes[(Math.floor(Math.random() * (themes.length - 1)) + 1)];
}

export default function(state = dTheme, action) {
	switch (action.type) {
		case "SET_THEME": {
			let theme;
			for (let iTheme of themes) {
				if (iTheme.title === action.payload.title) {
					theme = iTheme;
				}
			};
			theme = theme || state
			setProperty('theme', theme);
			return theme;
		}
		default: {
			return state;
		}
	}
};