var url = require('url');

function KueOptions() {
  // Redis To Go add-on on Heroku
  if (process.env.REDISTOGO_URL) {
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    this.redis = {
      port: parseInt(redisUrl.port),
      host: redisUrl.hostname,
    };
    if (redisUrl.auth) {
      this.redis.auth = redisUrl.auth.split(':')[1];
    }
  }
  // Redis Heroku add-on on Heroku
  else if (process.env.REDIS_URL) {
    this.redis = process.env.REDIS_URL;
  }
  // Else an empty config obj, will cause kue to use local defaults
};

module.exports = new KueOptions();
