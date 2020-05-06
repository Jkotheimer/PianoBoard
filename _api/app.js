#!/usr/bin/node

const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded());
app.use(express.json());
const port = 8081;

// ROOT directory returns api documentation pdf
app.get('/', (req, res) => {
	fs.readFile('API_documentation.pdf', function(err, data) {
		res.writeHead(200, {'Content-Type': 'application/pdf'});
		res.write(data);
		return res.end();
	});
});

/**
 * AUTHENTICATION ROUTES
 * ____________________________________________________________________________
 */

app.post('/auth/register', require('./auth/register.js'));
app.post('/auth/login', require('./auth/login.js'));


/**
 * USER CRUD
 * ____________________________________________________________________________
 */

app.get('/:user', require('./user/read.js'));
app.put('/:user', require('./user/update.js'));
app.delete('/:user', require('./user/delete.js'));

/**
 * PROJECT CRUD
 * ____________________________________________________________________________
 */

app.post('/:user/projects', require('./user/projects/create.js'));
app.get('/:user/projects/:project', require('./user/projects/read.js'));
app.put('/:user/projects/:project', require('./user/projects/update.js'));
app.delete('/:user/projects/:project', require('./user/projects/delete.js'));

/**
 * TRACK CRUD
 * ____________________________________________________________________________
 */

app.post('/:user/projects/:project/tracks', require('./user/projects/tracks/create.js'));
app.get('/:user/projects/:project/tracks/:track', require('./user/projects/tracks/read.js'));
app.put('/:user/projects/:project/tracks/:track', require('./user/projects/tracks/update.js'));
app.delete('/:user/projects/:project/tracks/:track', require('./user/projects/tracks/delete.js'));

/**
 * RECORDING CRUD
 * ____________________________________________________________________________
 */

app.post('/:user/projects/:project/tracks/:track/recordings',
	require('./user/projects/tracks/recordings/create.js'));
app.get('/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/read.js'));
app.put('/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/update.js'));
app.delete('/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/delete.js'));

/**
 * NOTE CRUD
 * ____________________________________________________________________________
 */

app.post('/:user/projects/:project/tracks/:track/recordings/:recording/notes',
	require('./user/projects/tracks/recordings/notes/create.js'));
app.get('/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/read.js'));
app.put('/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/update.js'));
app.delete('/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/delete.js'));


// Start up the server
app.listen(port, () => console.log(`pianoboard API listening at http://localhost:${port}`));
