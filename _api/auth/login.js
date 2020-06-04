#!/usr/bin/node

const validator = require("email-validator");
const crypto = require('./auth.js');

module.exports = function(req, res) {

	const mysql = require(`${req.app.locals.root}/sql_connect.js`);

	const login = req.body.login;
	const password = req.body.password;
	
	// We can't verify the login becase it will either be a username, password, or ID
	// but we can verify that the password is the correct length before attempting a
	// potentially meaningless mysql query
	if(password.length < 8) {
		res.status(403).json({message: 'Password too weak'});
	}

	mysql.query(`SELECT AccountId, Salt, Password FROM Account WHERE Email='${login}' OR Username='${login}'`,
		async function(err, data, fields) {
			if(err) {
				// No account exists with that login
				res.status(404).json({message: 'Email or Username not found'});
			}
			if(data.length != 0) {
				data = data[0];
				if(crypto.verify_password(password, data.Salt, data.Password)) {
					// The user is authenticated - set token cookies and return
					const token = crypto.gen_token();
					const exp_date = req.app.locals.resources.new_date(req.app.locals.token_exp);
					// Delete any existing tokens for this user then insert the new one
					var promise = new Promise((resolve, reject) => {
							mysql.query(`DELETE FROM Access_token WHERE AccountID=${data.AccountId};`,
								(err, data) => {resolve(err)}
							);
					});
					// We do nothing with this variable - it's here to pause the code before inserting a new token
					var deleted = await promise;
					mysql.query(`INSERT INTO Access_token (Token, AccountID, Expiration_date) VALUES
						('${token}', '${data.AccountId}', '${exp_date}');`,
						(err, data) => {if(err) throw err}
					);
					res.cookie('pb_token', token, {domain: req.app.locals.domain, path: '/', maxAge: req.app.locals.token_exp});
					res.cookie('pb_uid', data.AccountId, {domain: req.app.locals.domain, path: '/', maxAge: req.app.locals.token_exp});
					res.status(200).json({message: 'Successfully logged in!'});
				} else {
					// The password authentication failed
					res.status(403).json({message: 'Incorrect password'});
				}
			} else {
				// There was no error but nothing returned from the query
				res.status(404).json({message: 'Email or Username not found'});
			}
		} // End query callback
	);
}
