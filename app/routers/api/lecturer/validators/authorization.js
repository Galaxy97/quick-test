const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['first_name', 'last_name', 'hash', 'id'],
  properties: {
    first_name: {type: 'string'},
    last_name: {type: 'string'},
    hash: {type: 'string'},
    id: {type: 'number'},
  },
});

module.exports = schema;
