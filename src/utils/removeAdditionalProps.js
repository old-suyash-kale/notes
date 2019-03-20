import {cloneObject} from "./";

export default (props, AdditionalProps)=> {
	props = cloneObject(props);
	for (let i in AdditionalProps) {
		let prop = AdditionalProps[i];
		if (typeof props[prop] != "undefined") {
			delete props[prop];
		}
	}
	return props;
};