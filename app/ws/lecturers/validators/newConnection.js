const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['token', 'code'],
  properties: {
    token: {type: 'string'},
    code: {type: 'string'},
  },
});

module.exports = schema;
