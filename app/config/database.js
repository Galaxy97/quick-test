require('dotenv').config();

module.exports = {
  HOST: process.env.DBHOST,
  PORT: process.env.DBPORT,
  NAME: process.env.DBNAME,
  USER: process.env.DBUSER,
};
