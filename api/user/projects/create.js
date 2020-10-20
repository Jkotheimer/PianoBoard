#!/usr/bin/node

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
	console.log("Fucking shit");
	var check_existing_project = function(name) {
		
		let query = `SELECT id FROM project WHERE user_id=${uid} AND name=${name};`;
		return new Promise(resolve => {
			mysql.query(query, (err, data) => {
				console.log("Retrieved data as to whether this project already exists");
				console.log(data);	
				resolve(data);
			});
		});
	}

	var create_project = function(att) {
		check_existing_project(att.name);
		let query = `INSERT INTO project (user_id, name, genre, time_signature_num, time_signature_den, tempo, creation_date, is_private)
			VALUES ('${uid}', '${att.name}', '${att.genre ? att.genre : 'Pop'}', '${att.time_signature[0] ? att.time_signature[0] : 4}',
			'${att.time_signature[1] ? att.time_signature[1] : 4}', '${att.tempo ? att.tempo : 120}', '${resources.new_date(0)}', 
			${att.is_private ? att.is_private : false});`;
		return new Promise(resolve => {
			mysql.query(query, (err, data) => {
				console.log("new project successfully inserted");
				console.log(data);
				if(err || !data) resolve(err);
				else resolve(data);
			});
		});
	}

	var message = {};
	var result = await create_project(req.body);
	res.status(200).json(message);
}
