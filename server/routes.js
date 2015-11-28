var app = require('./server');
var sendEmail = require('../senders/email');

app.post('/email', function(req, res) {
  console.log('REQ.BODY:', req.body);
  var email = req.body.email;
  var message = req.body.message;
  var datetime = req.body.datetime;
  var date = new Date(datetime);
  console.log(datetime);
  console.log(date);
  res.status(200).end('Awesome. Check your email!');

  // sendEmail(email, message, function(err, info) {
  //   if (err) {
  //     console.log('An error occured: ' + err);
  //     res.status(404).end('Whoops... something went wrong.');
  //   }

  //   console.log('Message sent: ' + info.response);
  //   res.status(200).end('Awesome. Check your email!');
  // });
});
