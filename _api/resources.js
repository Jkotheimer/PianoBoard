#!/usr/bin/node

const mysql = require('./sql_connect.js');

// This function iterates through a list of usernames that already exist
// If the username we want to add exists in the database already,
// then add one to the number at the end of the username and try again
var gen_username_recursive = function(err, data, username, num) {
	if(err || !data) return;
	var username_concat = num == 0 ? username : `${username}${num}`;
	data.forEach((item, index) => {
		if(item.Username == username_concat) {
			username_concat = gen_username_recursive(err, data, username,  ++num);
			return;
		}
	});
	return username_concat;
}

async function gen_username(email) {
	var username = email.split('@')[0];
	var promise = new Promise((resolve, reject) => {
		mysql.query(
			`SELECT Username FROM Account WHERE Username REGEXP '^${username}';`,
			(err, data) => resolve(gen_username_recursive(err, data, username, 0))
		);
	});
	username = await promise;
	return username;
}

var new_date = function(offset) {
	return new Date(Date.now() + offset).toISOString().slice(0, 19).replace('T', ' ');
}

function comp(err, data, uid) {
	if(err || data.length == 0) return -1;
	return uid - data[0].AccountID;
}

async function user_compare(uid, login) {
	var promise = new Promise((resolve, reject) => {
		mysql.query(`SELECT AccountID FROM Account WHERE AccountID='${login}' OR Username='${login}' OR Email='${login}'`,
			(err, data) => resolve(comp(err, data, uid))
		);
	})
	var result = await promise;
	return result;
}

module.exports = {
	gen_username: gen_username,
	new_date: new_date,
	user_compare: user_compare
}
