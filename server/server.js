// Initialize express app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/*===========================================================================/
/                             MIDDLEWARE                                     /
/===========================================================================*/

app.use(express.static(__dirname + '/../public'));

module.exports = app;
