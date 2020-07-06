#!/usr/bin/node

const mysql = require('./sql_connect.js');

// This function iterates through a list of usernames that already exist
// If the username we want to add exists in the database already,
// then add one to the number at the end of the username and try again
var gen_username_recursive = function(err, data, username, num) {
	if(err || !data) return username;
	var username_concat = num == 0 ? username : `${username}${num}`;
	data.forEach((item, index) => {
		if(item.username == username_concat) {
			username_concat = gen_username_recursive(err, data, username,  ++num);
			return;
		}
	});
	return username_concat;
}

async function gen_username(email) {
	// First, check if the email address exists in the database - if so, return false
	var promise = new Promise((resolve, reject) => {
		mysql.query(
			`SELECT email FROM user WHERE email = '${email}'`,
			(err, data) => {
				if(data && data.length > 0) resolve(true);
				else resolve(false);
			}
		);
	});
	var exists = await promise;
	if(exists) return false;
	var username = email.split('@')[0];
	promise = new Promise((resolve, reject) => {
		mysql.query(
			`SELECT username FROM user WHERE username REGEXP '^${username}';`,
			(err, data) => resolve(gen_username_recursive(err, data, username, 0))
		);
	});
	return promise;
}

var new_date = function(offset) {
	return new Date(Date.now() + offset).toISOString().slice(0, 19).replace('T', ' ');
}

function comp(err, data, uid) {
	if(err || data.length == 0) return -1;
	return uid - data[0].id;
}

async function user_compare(uid, login) {
	var promise = new Promise((resolve, reject) => {
		mysql.query(`SELECT id FROM user WHERE id = '${login}' OR username = '${login}' OR email = '${login}'`,
			(err, data) => resolve(comp(err, data, uid))
		);
	});
	return promise;
}

module.exports = {
	gen_username: gen_username,
	new_date: new_date,
	user_compare: user_compare
}
