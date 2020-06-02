#!/usr/bin/node

// PUT /users/<user>
// Where <user> is a Username, Email, or UID
module.exports = async function(req, res) {

	const local = req.app.locals;
	const auth = require(`${local.root}/auth/auth.js`);
	const mysql = require(`${local.root}/sql_connect.js`);
	const resources = require(`${local.root}/resources.js`);
	const uid = await auth.current_user(req);

	if(!uid) {
		// The request did not come from an authenticated user - return a 401
		res.status(401).json({message: 'You are not logged in'});
	}
	const login = req.params.user;
	const user_consistency = await resources.user_compare(uid, login);
	if(user_consistency != 0) {
		// The logged in user is not the same as the user they are attempting to modify
		res.status(401).json({message: 'You are not authorized to alter this account'});
	}

	const attributes = req.body;
	console.log(attributes);
	for(attribute in attributes) {
		switch(attribute.toLowerCase()) {
			case 'username':
				console.log(`updating username to ${attribute}`);
				break;
			case 'email':
				console.log(`updating email to ${attribute}`);
				break;
			case 'is_private':
				console.log(`updating is_private to ${attribute}`);
				break;
			case 'favorite_genres':
				console.log(`adding ${attribute} to favorite genres`);
				break;
			case 'favorite_artists':
				console.log(`adding ${attribute} to favorite artists`);
				break;
			default:
				break;
		}
	}

	res.status(200).json({message: 'working'});

}
