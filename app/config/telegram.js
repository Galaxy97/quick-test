require('dotenv').config();

module.exports = {
  AUTH_TOKEN: process.env.TELEGRAM_AUTH_TOKEN,
  BOT_URL: process.env.TELEGRAM_BOT_URL,
};
