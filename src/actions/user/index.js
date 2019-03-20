export function setUser(payload, remember) {
	return {
		type: 'SET_USER',
		payload,
		remember
	};
};