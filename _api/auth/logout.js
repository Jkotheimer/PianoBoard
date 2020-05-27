#!/usr/bin/node

const crypto = require('./auth.js');

module.exports = function(req, res) {
	
	const mysql = require(`${req.app.locals.root}/sql_connect.js`)
	const uid = req.cookies.pb_uid;
	const platform = req.query.platform;

	mysql.query(`DELETE FROM Access_token WHERE AccountID = ${uid};`);

	res.clearCookie('pb_token', {domain: req.app.locals.domain, path: '/'});
	res.clearCookie('pb_uid', {domain: req.app.locals.domain, path: '/'});

	if(platform == 'web') res.redirect('/');
	else res.status(200).json({message: 'Logout successful'});
}
