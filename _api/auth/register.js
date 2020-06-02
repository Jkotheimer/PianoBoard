#!/usr/bin/node

const validator = require("email-validator");
const crypto = require('./auth.js');

module.exports = function(req, res) {
	
	const local = req.app.locals;
	const mysql = require(`${local.root}/sql_connect.js`);
	
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password

	var body = {message: {}};

	if(!validator.validate(email)) {
		// If the request was sent from a web browser, send a redirect back to the create account page
		body.message.email_notification = 'Invalid Email Address';
	}
	if(password.length < 8) {
		body.message.password_notification = 'Password too weak';
	}
	if(password != confirm_password) {
		body.message.confirm_password_notification = 'Passwords do not match';
	}
	if(body.message.size > 0) res.status(400).json(body);

	// ALL IS WELL - ATTEMPT TO CREATE THE ACCOUNT
	async function create_account(_email, _password) {
		const username = await local.resources.gen_username(_email);
		const hashes = crypto.hash_password(_password)
		const timestamp = local.resources.new_date(0);
		mysql.query(`INSERT INTO Account (Email, Username, Password, Salt, Creation_date) VALUES 
			('${_email}', '${username}', '${hashes.hash}', '${hashes.salt}', '${timestamp}');`, 
			function(err, data) {
				if(err || !data) {
					// An account with this email already exists
					body.message.email_notification = 'An account with this email already exists';
					res.status(409).json(body);
				}
				else if(data) {
					const token = crypto.gen_token();
					// Token expires a month from today
					const exp_date = local.resources.new_date(local.token_exp);
					const account_id = data.insertId;
					set_token(account_id, token, exp_date);
					res.cookie('pb_token', token, {domain: local.domain, path: '/', maxAge: local.token_exp});
					res.cookie('pb_uid', account_id, {domain: local.domain, path: '/', maxAge: local.token_exp});
					body.message =  'Account successfully created!';
					res.status(201).json(body);
					
				} // End data check
				else {
					body.message = 'Something unexpected happened :/';
					res.status(500).json(body);
				}
			} // End account insertion callback
		);

	} // End create account

	var set_token = function(account_id, token, exp_date) {
		mysql.query(`INSERT INTO Access_token (Token, AccountID, Expiration_date) VALUES
			('${token}', '${account_id}', '${exp_date}');`,
			(err, data) => {
				if(err) {
					body.message = 'Something went wrong :/ we cannot authenticate you right now';
					res.status(500).json(body);
				}
			}
		)
	}

	create_account(email, password);
}
