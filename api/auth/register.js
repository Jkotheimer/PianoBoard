#!/usr/bin/node

const validator = require("email-validator");
const crypto = require('./auth.js');

module.exports = function(req, res) {
	
	const local = req.app.locals;
	const mysql = require(`${local.root}/sql_connect.js`);
	
	console.log(req.body);
	const req_body = JSON.parse(req.body);
	const email = req_body.email;
	const password = req_body.password;
	const confirm_password = req_body.confirm_password
	console.log(req_body.password);

	var res_body = {message: {}};

	if(!validator.validate(email)) {
		// If the request was sent from a web browser, send a redirect back to the create account page
		res_body.message.email_notification = 'Invalid Email Address';
	}
	if(password.length < 8) {
		res_body.message.password_notification = 'Password too weak';
	}
	if(password != confirm_password) {
		res_body.message.confirm_password_notification = 'Passwords do not match';
	}
	if(res_body.message.size > 0) res.status(400).json(body);

	// ALL IS WELL - ATTEMPT TO CREATE THE ACCOUNT
	async function create_account(_email, _password) {
		const username = await local.resources.gen_username(_email);
		if(!username) {
			res_body.message.email_notification = 'An account with this email already exists';
			res.status(400).json(body);
			return;
		}
		const hashes = crypto.hash_password(_password)
		const timestamp = local.resources.new_date(0);
		mysql.query(`INSERT INTO user (email, username, password, salt, creation_date) VALUES 
			('${_email}', '${username}', '${hashes.hash}', '${hashes.salt}', '${timestamp}');`, 
			function(err, data) {
				if(err || !data) {
					// An account with this email already exists
					res_body.message.email_notification = 'An account with this email already exists';
					res.status(409).json(body);
				}
				else if(data) {
					// The insertion worked, create a token and return a 201
					const token = crypto.gen_token();
					// Token expires a month from today
					const exp_date = local.resources.new_date(local.token_exp);
					const user_id = data.insertId;
					set_token(user_id, token, exp_date);
					res.cookie('pb_token', token, {domain: local.domain, path: '/', maxAge: local.token_exp});
					res.cookie('pb_uid', user_id, {domain: local.domain, path: '/', maxAge: local.token_exp});
					body.message =  'Account successfully created!';
					res.status(201).json(body);
					
				} // End data check
				else {
					res_body.message = 'Something unexpected happened :/';
					res.status(500).json(body);
				}
			} // End account insertion callback
		);

	} // End create account

	var set_token = function(user_id, token, exp_date) {
		mysql.query(`INSERT INTO access_token (token, user_id, expiration_date) VALUES
			('${token}', '${user_id}', '${exp_date}');`,
			(err, data) => {
				if(err) {
					res_body.message = 'Something went wrong :/ we cannot authenticate you right now';
					res.status(500).json(body);
				}
			}
		)
	}

	create_account(email, password);
}
