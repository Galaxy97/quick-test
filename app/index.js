/* eslint-disable import/order */
const app = require('./app');
const server = require('http').createServer(app);

// module.exports.server = server;
// const io = require('./sockets');
// const Bot = require('./ws/bot');
const Lecturers = require('./ws/lecturers');
const config = require('./config');
const knex = require('./db');
const authBot = require('./utils/authBot');

knex
  .raw('select 1+1 as result')
  .then(() => {
    authBot.launch();
    server.listen(config.server.PORT, () => {
      Lecturers.handle();
      console.log(
        `Server running at ${config.server.HOST} port ${config.server.PORT}`,
      );
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
