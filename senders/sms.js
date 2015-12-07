// mtextbelt is a wrapper for the public textbelt API
var tb = require('mtextbelt');

// module.exports = function(phoneNumber, message, cb) {
//   // Send an sms using textbelt
//   tb.send(phoneNumber, message, function(err, resp) {
//     if (err) return cb(err);
//     return cb(null, resp);
//   });
// };

// Using the standard method works fine here now, might want to
//   do more in the future
module.exports = tb.send;
