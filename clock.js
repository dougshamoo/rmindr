var kue = require('kue');
var url = require('url');
var redis = require('kue/lib/redis');

// Senders
var sendEmail = require('./senders/email');
var sendSms = require('./senders/sms');

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

queue.on('job enqueue', function(id, type) {
  console.log('clock.js: Job %s got queued of type %s', id, type);
}).on('job complete', function(id, result) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    job.remove(function(err) {
      if (err) throw err;
      console.log('clock.js: removed completed job #%d', job.id);
    });
  });
});

// Send email when job with type 'email' is ready
queue.process('email', function(job, done) {
  console.log('Processing job #', job.id, ':\n', job.data);
  sendEmail(job.data.to, job.data.message, done);
});

// Send SMS when job with type 'sms' is ready
queue.process('sms', function(job, done) {
  console.log('Processing job #', job.id, ':\n', job.data);
  sendSms(job.data.phone, job.data.message, done);
});
