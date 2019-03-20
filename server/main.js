let { registerRoute } = require('./utils/registerRoute/index'); // default route handler;

let { oUser } = require('./classes/User');
let { oNotes } = require('./classes/Notes');

let route = function() {
	registerRoute.apply(this, arguments);
};

module.exports = {
	routes: function({ app, BASE_URL }) {
		route = route.bind({ app, BASE_URL });

		// user;
		route('/Signup', {auth: false, type: 'post'}, oUser.rSignup); // signup;
		route('/Signin', {auth: false, type: 'post'}, oUser.rSignin); // signin;
		route('/EmailVerify', {auth: false, type: 'post'}, oUser.rEmailVerify); // email verification;

		// notes;
		route('/Notes', {}, oNotes.rGet); // get notes;
		route('/Notes', {type: 'post'}, oNotes.rAdd); // add note;
		route('/Notes/:note_id', {type: 'delete'}, oNotes.rTrash); // delete note;
		route('/Notes/Title/:note_id', {type: 'put'}, oNotes.rUpdateTitle); // update title;
		route('/Notes/Description/:note_id', {type: 'put'}, oNotes.rUpdatedDescription); // update description;
		route('/Notes/Share/:note_id', {auth: false, connection: false, type: 'post'}, oNotes.rShare); // get share link;
		route('/Notes/Share/:note', { auth: false }, oNotes.rNote); // get node from shared link;
		route('/Notes/Pin/:note_id', { type: 'post' }, oNotes.rPin); // pin/ unpin;
	}
};