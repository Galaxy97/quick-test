const db = {
  HOST: process.env.DBHOST,
  PORT: process.env.DBPORT,
  NAME: process.env.DBNAME,
  USER: process.env.DBUSER,
  PASSWORD: process.env.DBPASSWORD,
};

const server = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
};

const telegram = {
  AUTH_TOKEN: process.env.TELEGRAM_AUTH_TOKEN,
  BOT_URL: process.env.TELEGRAM_BOT_URL,
  BOT_TOKEN: process.env.BOT_TOKEN,
};

const redis = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.REDIS_PORT || 6379,
  USER: process.env.REDIS_USER || 'h',
  PASS: process.env.REDIS_PASS,
  URL: process.env.REDIS_URL,
};

module.exports = {
  server,
  db,
  telegram,
  redis,
};
