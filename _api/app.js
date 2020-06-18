#!/usr/bin/node

const express = require('express');
const fs = require('fs');
const app = express();
const port = 8081;
const ROOT = require('path').dirname(require.main.filename);
const resources = require('./resources.js');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(require('cookie-parser')());
app.locals.title = 'Pianoboard';
app.locals.email = 'jkotheimer9@gmail.com';
app.locals.host = 'http://localhost';
app.locals.domain = 'localhost';
app.locals.token_exp = 604800000;
app.locals.root = ROOT;
app.locals.resources = resources;

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
app.post('/auth/logout', require('./auth/logout.js'));
app.get('/auth/logout', require('./auth/logout.js'));


/**
 * USER CRUD
 * ____________________________________________________________________________
 */

app.get('/users/:user', require('./user/read.js'));
app.put('/users/:user/:attribute', require('./user/update.js'));
app.delete('/users/:user/:attribute', require('./user/delete_attribute.js'));
app.delete('/users/:user', require('./user/delete.js'));

/**
 * PROJECT CRUD
 * ____________________________________________________________________________
 */

app.post('/users/:user/projects', require('./user/projects/create.js'));
app.get('/users/:user/projects/:project', require('./user/projects/read.js'));
app.put('/users/:user/projects/:project', require('./user/projects/update.js'));
app.delete('/users/:user/projects/:project', require('./user/projects/delete.js'));

/**
 * TRACK CRUD
 * ____________________________________________________________________________
 */

app.post('/users/:user/projects/:project/tracks', require('./user/projects/tracks/create.js'));
app.get('/users/:user/projects/:project/tracks/:track', require('./user/projects/tracks/read.js'));
app.put('/users/:user/projects/:project/tracks/:track', require('./user/projects/tracks/update.js'));
app.delete('/users/:user/projects/:project/tracks/:track', require('./user/projects/tracks/delete.js'));

/**
 * RECORDING CRUD
 * ____________________________________________________________________________
 */

app.post('/users/:user/projects/:project/tracks/:track/recordings',
	require('./user/projects/tracks/recordings/create.js'));
app.get('/users/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/read.js'));
app.put('/users/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/update.js'));
app.delete('/users/:user/projects/:project/tracks/:track/recordings/:recording',
	require('./user/projects/tracks/recordings/delete.js'));

/**
 * NOTE CRUD
 * ____________________________________________________________________________
 */

app.post('/users/:user/projects/:project/tracks/:track/recordings/:recording/notes',
	require('./user/projects/tracks/recordings/notes/create.js'));
app.get('/users/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/read.js'));
app.put('/users/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/update.js'));
app.delete('/users/:user/projects/:project/tracks/:track/recordings/:recording/notes/:note',
	require('./user/projects/tracks/recordings/notes/delete.js'));


// Start up the server
app.listen(port, () => console.log(`pianoboard API listening at http://localhost:${port}`));
