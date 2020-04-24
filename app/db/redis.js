const redis = require('redis');
const config = require('../config');

const client = redis.createClient(
  config.redis.URL
    ? {url: config.redis.URL}
    : {
        host: config.redis.HOST,
        port: config.redis.PORT,
        user: config.redis.USER,
        password: config.redis.PASS,
      },
);

module.exports = client;
