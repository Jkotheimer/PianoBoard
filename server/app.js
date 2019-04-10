// [SETUP}
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = 80;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

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

app.listen(port, function() {
	console.log(`test app listening on port ${port}`)
});