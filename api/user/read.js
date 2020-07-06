#!/usr/bin/node

/**
 * This function returns data about the requested user
 * Step-through of logic:
 * 0) Check if the current user is authenticated - if not, return a 401
 * 1) Retrieve everything except for the password and salt from the requested user
 * 2) Check if the user is public or private
 * 3) If public, gather all info about the user and return everything
 * 4) If private, check if the request came from the private user - if so, treat as if public
 * 5) If not, return 401
 */
module.exports = function(req, res) {
	res.send(`Hello, ${req.params.user}`)

	
}
