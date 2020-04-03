require('dotenv').config();

module.exports = {
  TOKEN_AUTH: process.env.TELEGRAM_AUTH_TOKEN,
  TOKEN_IO: process.env.TELEGRAM_IO_TOKEN,
};
