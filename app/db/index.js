const Knex = require('knex');

const config = require('../config');
const dbOptions = require('./knexfile')[config.server.NODE_ENV];

const knex = new Knex(dbOptions);
console.log('<<<--- database connected --->>>');

module.exports = knex;
