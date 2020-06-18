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

	const attribute = req.params.attribute;
	const value = req.body.value;
	var message = {};
	var stat = 200;
	if(!attribute.includes('favorite')) {
		stat = 400;
		message[`${attribute}_notification`] = `${attribute} is not a deletable attribute`;
	} else {
		var deleted = await delete_favorite(attribute, value);
		if(deleted) {
			message[`${attribute}_notification`] = `Successfully deleted ${value} from your ${attribute.split('_', 2)}`;
			message[attribute] = value;
		}
		else {
			message[`${attribute}_notification`] = `Could not delete ${value} from your ${attribute.split('_', 2)}`;
			stat = 400;
		}
	}
	res.status(stat).json(message);
}
