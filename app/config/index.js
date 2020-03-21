const db = require('./database');
const server = require('./server');
const telegram = require('./telegram');

module.exports = {
  server,
  db,
  telegram,
};
