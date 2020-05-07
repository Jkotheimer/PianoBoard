#!/usr/bin/node

var gen_username = function(email) {
	var username = email.split('@')[0];
	var postfix = email.split('@')[1];
	var sum = 0;
	[...postfix].forEach(c => sum += c.charCodeAt(0));
	return username + sum.toString();
}

var new_date = function(offset) {
	return new Date(Date.now() + offset).toISOString().slice(0, 19).replace('T', ' ');
}

var new_cookie_date = function(offset) {
	return new Date(Number(new Date()) + offset);
}

module.exports = {
	gen_username: gen_username,
	new_date: new_date,
	new_cookie_date: new_cookie_date
}
