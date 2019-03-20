const ITEM = "MSK_NOTES",
	DEFAULT_PROPS = {
	};

function get() {
	let item = localStorage.getItem(ITEM);
	if (!item) {
		item = JSON.stringify(set({}));
	}
	return JSON.parse(item);
};

function set(item) {
	localStorage.setItem(ITEM, JSON.stringify(item));
	return get();
};

function getProperty(prop) {
	let item = get()[prop];
	return (typeof item == "undefined" ? DEFAULT_PROPS[prop] : item);
};

function setProperty(prop, val) {
	let item = get();
	item[prop] = val;
	return set(item);
};


export {
	getProperty,
	setProperty
};