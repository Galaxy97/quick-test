/* eslint-disable import/order */
const url = require('url');
const app = require('./app');
const server = require('http').createServer(app);

const Lecturers = require('./ws/lecturers');
const config = require('./config');
const {knex, redis} = require('./db');
const authBot = require('./utils/authBot');

server.on('upgrade', function upgrade(request, socket, head) {
  const {pathname} = url.parse(request.url);

  if (pathname === '/lecturer') {
    Lecturers.wss.handleUpgrade(request, socket, head, ws => {
      Lecturers.wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

redis.on('error', err => {
  console.log(err.message);
  process.exit(1);
});

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
