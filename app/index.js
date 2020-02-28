const app = require('./app');
// eslint-disable-next-line import/order
const server = require('http').createServer(app);

const config = require('./config');

server.listen(config.server.PORT, () => {
  console.log(
    `Server running at ${config.server.HOST} port ${config.server.PORT}`,
  );
});
