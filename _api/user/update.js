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
		return;
	}
	const login = req.params.user;
	const user_consistency = await resources.user_compare(uid, login);
	if(user_consistency != 0) {
		// The logged in user is not the same as the user they are attempting to modify
		res.status(401).json({message: 'You are not authorized to alter this account'});
		return;
	}

	var update = function(attribute, value) {
		var promise = new Promise((resolve, reject) => {
			mysql.query(`UPDATE user SET ${attribute} = ${value} WHERE id = ${uid}`,
				(err, data) => {
					if(err || data.length == 0) resolve(false);
					else resolve(true);
				}
			);
		});
		return promise;
	}

	var update_favorite = function(type, value) {
		var promise = new Promise((resolve, reject) => {
			mysql.query(`INSERT INTO ${type} (user_id, value) VALUES ('${uid}', '${value}');`,
				(err, data) => {
					if(err || data.length == 0) resolve(false);
					else resolve(true);
				}
			);
		});
		return promise;
	}

	var message = {};
	var stat = 200;
	var success = null;
	const attribute = req.params.attribute;
	const value = req.body.value;
	switch(attribute.toLowerCase()) {
		case 'email':
		case 'username':
			success = await update(attribute, `'${value}'`);
			if(!success) message[`${attribute}_notification`] = `An account with this ${attribute} already exists`;
			break;
		case 'is_private':
			success = await update(attribute, value);
			if(!success) message[`${attribute}_notification`] = `Could not set your privacy to ${value} at this time`;
			break;
		case 'favorite_artists':
		case 'favorite_genres':
			var sep_words = attribute.split('_', 2);
			success = await update_favorite(attribute, value);
			if(!success) message[`${attribute}_notification`] = `You already have ${value} as a ${sep_words[0]} ${sep_words[1]}`;
			break;
		default:
			break;
	}
	if(success) {
		message[attribute] = value;
		// If the attribute name has an underscore (favorite_genres), optionally split it and print it as separate words
		var name = attribute.includes('_') ? attribute.split('_', 2) : attribute;
		message[`${attribute}_notification`] = `${name == attribute ? name : `${name[0]} ${name[1]}`} successfully updated!`;
	}
	else stat = 400;

	res.status(stat).json(message);

}
