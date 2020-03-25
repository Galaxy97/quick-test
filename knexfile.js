const config = require('./app/config').db;

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: config.HOST,
      port: config.PORT,
      database: config.NAME,
      user: config.USER,
      password: config.PASSWORD || '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './app/migrations',
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: config.HOST,
      port: config.PORT,
      database: config.NAME,
      user: config.USER,
      password: config.PASSWORD || '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './app/migrations',
    },
  },
};
