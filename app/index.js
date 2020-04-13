const app = require('./app');
// eslint-disable-next-line import/order
const server = require('http').createServer(app);

const config = require('./config');
const knex = require('./db');
const authBot = require('./utils/authBot');

knex
  .raw('select 1+1 as result')
  .then(() => {
    authBot.launch();
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
