// [SETUP}

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = 80;

app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
// [END SETUP]

app.get('/', function(req, res) {
	res.send('Hello, World!');
});

app.post('/', function(req, res) {
	res.send('A post request has been made');
});

var server = app.listen(port, function () {
    console.log("Server started at http://localhost:%s", port);
});