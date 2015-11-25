var app = require('./server/server');
require('./server/routes');
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Server listening on port ' + port + '...');
