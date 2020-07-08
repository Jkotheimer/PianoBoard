#!/usr/bin/node

const util = require('util')
const sql_config = require('./sql_config.jsecret')

var pool = require('mysql').createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: sql_config.mysql_username,
	password: sql_config.mysql_password,
	database: 'pianoboard'
});

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.')
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.')
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.')
		}
	}
	if (connection) connection.release()

	return
})

pool.query = util.promisify(pool.query)

module.exports = pool
