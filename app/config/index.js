const db = require('./database');
const server = require('./server');
const telegram = require('./telegram');
const ws = require('./ws');

module.exports = {
  server,
  db,
  telegram,
  ws,
};
