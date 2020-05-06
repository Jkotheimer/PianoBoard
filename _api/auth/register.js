#!/usr/bin/node

module.exports = function(req, res) {
	email = req.body.email;
	password = req.body.password;
	console.log(email + " : " + password)
	res.send("Sucessfully submitted post request")
}
