import { oUser } from '../../services/User';
import { getProperty, setProperty } from '../../utils/lsHelper';

let gUser = getProperty('remember') || false;
oUser.set(gUser);
export default function(state = gUser, action) {
	switch (action.type) {
		case "SET_USER": {
			let User = action.payload;
			if (action.remember) {
				setProperty('remember', User);
			}
			oUser.set(action.payload);
			return action.payload;
		}
		default: {
			return state;
		}
	}
};