var app = require('./server/server');
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Server listening on port ' + port + '...');
