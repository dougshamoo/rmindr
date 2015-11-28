var kue = require('kue');
var url = require('url');
var redis = require('kue/lib/redis');

var sendEmail = require('./senders/email');

// make sure we use the Heroku Redis To Go URL
// (put REDISTOGO_URL=redis://localhost:6379 in .env for local testing)

// if (process.env.REDISTOGO_URL) {
//   kue.redis.createClient = function() {
//     var redisUrl = url.parse(process.env.REDISTOGO_URL);
//     var client = redis.createClient(redisUrl.port, redisUrl.hostname);
//     if (redisUrl.auth) {
//       client.auth(redisUrl.auth.split(':')[1]);
//     }

//     return client;
//   };
// }

var queue;
if (process.env.REDISTOGO_URL) {
  queue = kue.createQueue({
    redis: 'process.env.REDISTOGO_URL',
  });
} else {
  queue = kue.createQueue();
}

queue.on('job enqueue', function(id, type) {
  console.log('Job %s got queued of type %s', id, type);
}).on('job complete', function(id, result) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    job.remove(function(err) {
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
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
