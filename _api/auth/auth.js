#!/usr/bin/node

const crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var gen_salt = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 * @param {string} pepper - random data stored in a secure location on the server
 */
var gen_hash = function(password, salt, pepper){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password + pepper);
    var value = hash.digest('hex');
    return {
        salt:salt,
        hash:value
    };
};

var hash_password = function(password) {
    const salt = gen_salt(16); /** Gives us salt of length 16 */
	const pepper = require('./pepper.jsecret');
    return gen_hash(password, salt, pepper);
}


var verify_password = function(password, salt, hash) {
	const pepper = require('./pepper.jsecret');
	const hashed_pass = gen_hash(password, salt, pepper).hash;
	return hashed_pass == hash;
}

var gen_token = function() {
	return gen_salt(64);
}

var check_token = function(err, data) {
	if(err || data.length == 0) return null;
	data = data[0];

	// Check if the token is still valid
	const exp_date = new Date(data.expiration_date);
	const now = new Date(Date.now());
	if(exp_date >= now) return data.user_id;
	return null;
}

var current_user = function(req) {
	const mysql = require(`${req.app.locals.root}/sql_connect.js`);
	const uid = req.cookies.pb_uid;
	const token = req.cookies.pb_token;

	var promise = new Promise((resolve, reject) => {
		mysql.query(`SELECT user_id, expiration_date FROM access_token WHERE user_id = ${uid} AND token = '${token}';`,
			(err, data) => resolve(check_token(err,data))
		);
	});
	return promise;
}

module.exports = {
	gen_token: gen_token,
	hash_password: hash_password,
	verify_password: verify_password,
	current_user: current_user
}
