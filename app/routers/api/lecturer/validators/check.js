const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['uuid'],
  properties: {
    uuid: {type: 'string'},
  },
});

module.exports = schema;
