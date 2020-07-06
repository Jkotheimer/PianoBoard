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
	} else {
		mysql.query(`DELETE FROM user WHERE id = ${uid};`,
			(err, data) => {
				if(err || data.length == 0)
					res.status(400).json({message: `User with id ${uid} does not exist`});
				else
					res.status(200).json({message: `Account ${uid} successfully deleted`});
			}
		);
	}
}
