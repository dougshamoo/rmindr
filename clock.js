var kue = require('kue');
var redis = require('kue/lib/redis');

// Senders
var sendEmail = require('./senders/email');
var sendSms = require('./senders/sms');

// Gets config options for kue based on local/dev/prod Redis instance
var kueOptions = require('./server/kueConfig.js');

// Create connection to queue
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
