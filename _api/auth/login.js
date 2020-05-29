#!/usr/bin/node

const validator = require("email-validator");
const crypto = require('./auth.js');

module.exports = function(req, res) {

	const mysql = require(`${req.app.locals.root}/sql_connect.js`);

	const login = req.body.login;
	const password = req.body.password;
	const platform = req.body.platform;
	
	// We can't verify the login becase it will either be a username, password, or ID
	// but we can verify that the password is the correct length before attempting a
	// potentially meaningless mysql query
	if(password.length < 8) {
		if(platform == 'web') {
			res.redirect(`/?password_notification=Password too weak&login=${login}`);
		} else {
			res.status(400).json({message: 'Password too weak'});
		}
	}

	console.log(login);
	mysql.query(`SELECT AccountId, Salt, Password FROM Account WHERE Email='${login}' OR Username='${login}'`,
		function(err, data, fields) {
			if(err) {
				console.log(err);
				// No account exists with that login
				if(platform == 'web') {
					console.log('not found before');
					res.redirect(`/?login_notification=Email or Username not found&login=${login}`);
				} else {
					res.status(403).json({message: 'Email or Username not found'});
				}
			}
			if(data.size != 0) {
				data = data[0];
				if(crypto.verify_password(password, data.Salt, data.Password)) {
					console.log('password authentication successful');
					// The user is authenticated - set token cookies and return
					const token = crypto.gen_token();
					const exp_date = req.app.locals.resources.new_date(req.app.locals.token_exp);
					mysql.query(`DELETE FROM Access_token WHERE AccountID='${data.AccountId}';`,
						(err, data) => {if(err) throw err}
					);
					mysql.query(`INSERT INTO Access_token (Token, AccountID, Expiration_date) VALUES
						('${token}', '${data.AccountId}', '${exp_date}');`,
						(err, data) => {if(err) throw err}
					);
					res.cookie('pb_token', token, {domain: req.app.locals.domain, path: '/', maxAge: req.app.locals.token_exp});
					res.cookie('pb_uid', data.AccountId, {domain: req.app.locals.domain, path: '/', maxAge: req.app.locals.token_exp});
					if(platform == 'web') {
						res.redirect('/');
					} else {
						res.status(200).json({message: 'Successfully logged in!'});
					}
				} else {
					// The password authentication failed
					if(platform == 'web') {
						res.redirect(`/?password_notification=Incorrect password&login=${login}`);
					} else {
						res.status(403).json({message: 'Incorrect password'});
					}
				}
			} else {
				// There was no error but nothing returned from the query
				if(platform == 'web') {
					res.redirect(`/?login_notification=Email or Username not found&login=${login}`);
				} else {
					res.status(403).json({message: 'Email or Username not found'});
				}
			}
		} // End query callback
	);
}
