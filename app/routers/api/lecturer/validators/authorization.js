const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['first_name', 'last_name', 'hash', 'id'],
  properties: {
    first_name: {type: 'string'},
    last_name: {type: 'string'},
    username: {type: 'string'},
    photo_url: {type: 'string'},
    auth_date: {type: 'number'},
    id: {type: 'number'},
    hash: {type: 'string'},
  },
});

module.exports = schema;
