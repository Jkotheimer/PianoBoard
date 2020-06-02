#!/usr/bin/node

const auth = require('./auth.js');

module.exports = async function(req, res) {
	
	const mysql = require(`${req.app.locals.root}/sql_connect.js`)
	const uid = await auth.current_user(req);

	res.clearCookie('pb_token', {domain: req.app.locals.domain, path: '/'});
	res.clearCookie('pb_uid', {domain: req.app.locals.domain, path: '/'});

	if(uid) mysql.query(`DELETE FROM Access_token WHERE AccountID = ${uid};`);
	// If the user is not authenticated, nothing happens - they are already logged out

	res.status(200).json({message: 'Logout successful'});
}
