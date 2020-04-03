const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['code', 'participant_id', 'first_name', 'last_name'],
  properties: {
    code: {type: 'string'},
    participant_id: {type: 'number'},
    first_name: {type: 'string'},
    last_name: {type: 'string'},
  },
});

module.exports = schema;
