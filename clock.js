var kue = require('kue');
var url = require('url');
var redis = require('kue/lib/redis');

var sendEmail = require('./senders/email');

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

// TODO: process only when given datetime is reached
queue.process('email', function(job, done) {
  console.log('Processing job #', job.id, ':\n', job.data);
  sendEmail(job.data.to, job.data.message, done);
});

// function email(address, message, done) {
//   // TODO: address checking maybe
//   if (2 > 3) {
//     return done(new Error('some error'));
//   }

//   // TODO: email send stuff...
//   done();
// }
