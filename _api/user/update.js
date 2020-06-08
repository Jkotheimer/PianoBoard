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
			mysql.query(`INSERT INTO ${type} (user_id, value) VALUES (${uid}, ${value});`,
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
	const params = req.body;
	for(val in params) {
		switch(val.toLowerCase()) {
			case 'email':
			case 'username':
				success = await update(val, `'${params[val]}'`);
				if(!success) message[`${val}_notification`] = `An account with this ${val} already exists`;
				break;
			case 'is_private':
				success = await update(val, params[val]);
				if(!success) message[`${val}_notification`] = `Could not set your privacy to ${params[val]} at this time`;
				break;
			case 'favorite_genres':
				//if(typeof params[val])
				console.log(typeof params[val]);
				success = await update_favorite('genre', params[val]);
				if(!success) message[`${val}_notification`] = `You already have ${params[val]} as a favorite genre`;
				break;
			case 'favorite_artists':
				//if(typeof params[val])
				console.log(typeof params[val]);
				success = await update_favorite('artist', params[val]);
				if(!success) message[`${val}_notification`] = `You already have ${params[val]} as a favorite artist`;
				break;
			default:
				break;
		}
		if(success) {
			message[val] = params[val];
			message[`${val}_notification`] = `${val} successfully updated!`;
		}
		else stat = 400;
	}

	res.status(stat).json(message);

}
