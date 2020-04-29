const db = require('./database');
const server = require('./server');
const telegram = require('./telegram');
const ws = require('./ws');
const redis = require('./redis');

module.exports = {
  server,
  db,
  telegram,
  ws,
  redis,
};
