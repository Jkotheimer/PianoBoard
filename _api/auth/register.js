#!/usr/bin/node

const validator = require("email-validator");
const crypto = require('./auth.js');

module.exports = function(req, res) {
	
	const mysql = require(`${req.app.locals.root}/sql_connect.js`)
	
	const email = req.body.email;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password
	const platform = req.body.platform

	if(!validator.validate(email)) {
		// If the request was sent from a web browser, send a redirect back to the create account page
		if(platform == 'web') {
			res.status(302).set('Location', req.app.locals.host + '/create_account/' +
				'?email_notification=Invalid%20email%20address' +
				'&email=' + email)
		}
		// If the request came from anywhere else, send back an error code with a json message
		else {
			res.status(400).json({'message': 'Invalid email address'})
		}
	}
	if(password.length < 10) {
		if(platform == 'web') {
			res.redirect(req.app.locals.host + '/create_account/' +
				'?password_notification=Password%20too%20weak' +
				'&email=' + email);
		}
		else {
			res.status(400).json({'message': 'Password too weak'});
		}
	}
	if(password != confirm_password) {
		if(platform == 'web') {
			res.redirect(req.app.locals.host + '/create_account/' +
				'?confirm_password_notification=Passwords%20do%20not%20match' +
				'&email=' + email);
		}
		else {
			res.status(400).json({'message': 'Passwords do not match'});
		}
	}

	// ALL IS WELL - ATTEMPT TO CREATE THE ACCOUNT
	var create_account = function(_email, _password) {
		const username = req.app.locals.resources.gen_username(_email);
		const hashes = crypto.hash_password(_password)
		const timestamp = req.app.locals.resources.new_date(0);
		mysql.query("INSERT INTO Account (Email, Username, Password, Salt, Creation_date) VALUES ('" +
			_email + "', '" + username + "', '" + hashes.hash + "', '" + 
			hashes.salt + "', '" + timestamp + "');", 
			function(err, data) {
				if(err) {
					console.log(err)
					// An account with this email already exists
					if(platform == 'web') {
						res.redirect('/create_account/' +
							'?email_notification=Account with this email already exists' +
							'&email=' + _email);
					}
					else {
						res.status(400).json({'message': 'Account with this email already exists'});
					}
				}
				if(data) {
					const token = crypto.gen_token();
					// Token expires a month from today
					const exp_date = req.app.locals.resources.new_cookie_date(604800000);
					const account_id = data.insertId;
					set_token(account_id, token, req.app.locals.resources.new_date(604800000));
					res.cookie('pb_token', token, {domain: req.app.locals.domain, path: '/', expires: exp_date});
					res.cookie('pb_uid', account_id, {domain: req.app.locals.domain, path: '/', expires: exp_date});
					if(platform == 'web') {
						res.redirect('/')
					}
					else {
						res.status(201).json({'message': 'Account successfully created!'})
					}
				}
			}
		)
	}

	var set_token = function(account_id, token, exp_date) {
		mysql.query("INSERT INTO Access_token (Token, AccountID, Expiration_date) VALUES ('"	+
			token + "', '" + account_id + "', '" + exp_date + "');",
			(err, data) => {if(err) throw err}
		)
	}

	create_account(email, password);
}
