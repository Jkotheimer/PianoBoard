#!/usr/bin/node

module.exports = function(req, res) {
	res.send(`Hello, ${req.params.user}`)
}
