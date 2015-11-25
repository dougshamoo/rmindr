var nodemailer = require('nodemailer');
var config = require('../config');

module.exports = function(email, message, cb) {
  // create reusable transporter object using SMTP transport
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.gmail.user,
      pass: config.gmail.pass,
    },
  });

  // setup email data
  var mailOptions = {
    from: 'rmindr dev <rmindrdev@gmail.com>',
    to: email,
    subject: 'Reminder from Rmindr',
    text: message,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    cb(error, info);
  });
};
