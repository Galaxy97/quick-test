const app = require('./app');
// eslint-disable-next-line import/order
const server = require('http').createServer(app);

const config = require('./config');
const knex = require('./db');

knex
  .raw('select 1+1 as result')
  .then(() => {
    server.listen(config.server.PORT, () => {
      console.log(
        `Server running at ${config.server.HOST} port ${config.server.PORT}`,
      );
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
