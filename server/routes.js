var app = require('./server');

var moment = require('moment-timezone');
var kue = require('kue');
var ui = require('kue-ui');
var redis = require('kue/lib/redis');

var kueOptions = require('./kueConfig.js');
var queue = kue.createQueue(kueOptions);

//
//=================================KUE-UI====================================//
// Set up kue-ui
ui.setup({
  apiURL: '/api', // IMPORTANT: specify the api url
  baseURL: '/kue', // IMPORTANT: specify the base url
  updateInterval: 5000, // Optional: Fetches new data every 5000 ms
});

// Mount kue JSON api
app.use('/api', kue.app);

// Mount UI
app.use('/kue', ui.app);

//
//=================================ROUTES====================================//

app.post('/email', function(req, res) {
  // console.log('REQ.BODY:', req.body);
  var email = req.body.email;
  var message = req.body.message;
  var datetimeLocal = req.body.datetime;
  var timezone = req.body.timezone;

  var datetimeUTC = convertLocalToUTC(datetimeLocal, timezone);
  var jobDelay = getJobDelayFromLocalTime(datetimeLocal, timezone);

  // Create job
  var job = queue.create('email', {
    to: email,
    from: 'rmindrdev@gmail.com',
    message: message,
    datetime: datetimeUTC,
  }).delay(jobDelay)
  .save(function(err) {
    if (err) console.log(err);
  });

  // Job-level events are not guaranteed to be received upon process restarts,
  //  since restarted node.js process will lose reference to specific Job obj.
  //  Must use queue-level events for more reliability.
  // .on('complete', function(result) {
  //   console.log('Job completed with data', result);
  // })
  // .on('failed attempt', function(errorMessage, doneAttempts) {
  //   console.log('Job failed', doneAttempts, 'times:', errorMessage);
  // })
  // .on('failed', function(errorMessage) {
  //   console.log('Job failed:', errorMessage);
  // })

  res.status(200).end('Awesome. Check your email!');
});

app.post('/sms', function(req, res) {
  var phone = req.body.phone;
  var message = req.body.message;
  var datetimeLocal = req.body.datetime;
  var timezone = req.body.timezone;

  var datetimeUTC = convertLocalToUTC(datetimeLocal, timezone);
  var jobDelay = getJobDelayFromLocalTime(datetimeLocal, timezone);

  // Create job
  var job = queue.create('sms', {
    phone: phone,
    message: message,
    datetime: datetimeUTC,
  }).delay(jobDelay)
  .save(function(err) {
    if (err) console.log(err);
    res.status(200).end('Awesome. Check your phone!');
  });
});

//
//================================HELPERS===================================//

function convertLocalToUTC(datetimeLocal, timezone) {
  return moment.tz(datetimeLocal, timezone)
    .clone()
    .tz('UTC')
    .format('x');
}

function getJobDelayFromLocalTime(datetimeLocal, timezone) {
  // Convert local datetime + timezone from server into UTC time
  var datetimeUTC = convertLocalToUTC(datetimeLocal, timezone);

  // Calculate the desired delay in milliseconds
  var jobDelay = datetimeUTC - Date.now();

  return jobDelay;
}
