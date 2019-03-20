import io from 'socket.io-client';

let PORT = 4000;
let BASE_URL = 'APIs';
let Url = window.location.href;
let BaseUrl = `/${BASE_URL}/`;
let BasePath = "/";
let RootPath = "/";
let Platform = 1;
let IsDev;
let socket;

if (Url.search("localhost") > -1 || Url.search("127.0.0.1") > -1) {
	IsDev = true;
}

if (IsDev) {
	BaseUrl = `http://localhost:${PORT}/${BASE_URL}/`;
	socket = io(`http://localhost:${PORT}`);
} else {
	socket = io();

}

export {
	BaseUrl,
	BasePath,
	RootPath,
	Platform,
	IsDev,
	socket
};