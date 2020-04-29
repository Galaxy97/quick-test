require('dotenv').config();

module.exports = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.REDIS_PORT || 6379,
  USER: process.env.REDIS_USER || 'h',
  PASS: process.env.REDIS_PASS,
  URL: process.env.REDIS_URL,
};
