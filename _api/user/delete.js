#!/usr/bin/node

module.exports = async function(req, res) {
	
	const local = req.app.locals;
	const auth = require(`${local.root}/auth/auth.js`);
	const mysql = require(`${local.root}/sql_connect.js`);
	const resources = require(`${local.root}/resources.js`);
	const uid = await auth.current_user(req);

	if(!uid) {
		res.status(401).json({message: 'You are not logged in'});
		return;
	}
	const login = req.params.user;
	const user_consistency = await resources.user_compare(uid, login);
	if(user_consistency != 0) {
		res.status(401).json({message: 'You are not authorized to alter this account'});
		return;
	}

	var delete_favorite = function(type, value) {
		var promise = new Promise(resolve => {
			mysql.query(`DELETE FROM ${type} WHERE value = '${value}';`,
				(err, data) => {
					if(err || data.length == 0) resolve(false);
					else resolve(true);
				}
			);
		});
		return promise;
	}

	var delete_user = function() {
		var promise = new Promise(resolve => {
			mysql.query(`DELETE FROM user WHERE id = ${uid};`,
				(err, data) => {
					if(err || data.length == 0) resolve(false);
					else resolve(true);
				}
			)
		});
		return promise;
	}

	const params = req.body;
	var message = {};
	var stat = 200;
	if(!params) {
		// No attributes were specified, so delete the account
		if(delete_user()) {
			res.status(200).json({message: `Successfully deleted ${login}'s account`});
			return;
		} else {
			res.status(400).json({message: `Could not delete ${login}'s account`});
			return;
		}
	} else {
		// Attributes have been provided - just delete those attributes
		for(val in params) {
			if(!val.includes('favorite')) message[`${val}_notification`] = `${val} is not a deletable attribute`;
			else {
				var deleted = delete_favorite(val, params[val]);
				if(deleted) {
					message[`${val}_notification`] = `Successfully deleted ${params[val]} from your favorites`;
					message[val] = params[val];
				}
				else {
					message[`${val}_notification`] = `Could not delete ${params[val]} from your favorites`;
					stat = 400;
				}
			}
		}
		res.status(stat).json(message);
	}
}
