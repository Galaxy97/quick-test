const url = require('url');
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const server = http.createServer(app);
// lecturers - instance ws server
const lecturers = require('./ws/lecturers');
const config = require('./config');
const {knex, redis} = require('./db');
const authBot = require('./utils/authBot');

server.on('upgrade', (request, socket, head) => {
  const {pathname} = url.parse(request.url);

  if (pathname === '/lecturer') {
    lecturers.wss.handleUpgrade(request, socket, head, ws => {
      lecturers.wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

redis.on('error', err => {
  logger.error(err.message);
  process.exit(1);
});
// check db connection
knex
  .raw('select 1+1 as result')
  .then(() => {
    authBot.launch();
    server.listen(config.server.PORT, () => {
      lecturers.handle();
      logger.info(
        `Server running at ${config.server.HOST} port ${config.server.PORT}`,
      );
    });
  })
  .catch(err => {
    logger.error('system error', err);
    process.exit(1);
  });
