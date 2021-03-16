#!/usr/bin/node

const util = require('util')
const sql_config = require('./sql_config.jsecret')
const mysql = require('mysql');

console.log(sql_config.host);
console.log(sql_config.username);
console.log(sql_config.db);
console.log(sql_config.port);

var pool = mysql.createPool({
	connectionLimit: 10,
	host: sql_config.host,
	user: sql_config.username,
	password: sql_config.password,
	database: sql_config.db,
	port: sql_config.port
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
