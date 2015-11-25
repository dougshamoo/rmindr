// Initialize express app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

/*===========================================================================/
/                             MIDDLEWARE                                     /
/===========================================================================*/

app.use(express.static(__dirname + '/../public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = app;
