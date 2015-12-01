var app = require('./server');
var sendEmail = require('../senders/email');

var moment = require('moment-timezone');
var kue = require('kue');
var ui = require('kue-ui');
var url = require('url');
var redis = require('kue/lib/redis');

var kueOptions = {};

if (process.env.REDISTOGO_URL) {
  var redisUrl = url.parse(process.env.REDISTOGO_URL);
  kueOptions.redis = {
    port: parseInt(redisUrl.port),
    host: redisUrl.hostname,
  };
  if (redisUrl.auth) {
    kueOptions.redis.auth = redisUrl.auth.split(':')[1];
  }
}

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

//============================================================================//
//

app.post('/email', function(req, res) {
  console.log('REQ.BODY:', req.body);
  var email = req.body.email;
  var message = req.body.message;
  var datetimeLocal = req.body.datetime;
  var timezone = req.body.timezone;

  // Convert local datetime + timezone from server into UTC time
  var datetimeUTC = moment.tz(datetimeLocal, timezone)
    .clone()
    .tz('UTC')
    .format('x');

  // Calculate the desired delay in milliseconds
  var jobDelay = datetimeUTC - Date.now();
  console.log(jobDelay);

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
