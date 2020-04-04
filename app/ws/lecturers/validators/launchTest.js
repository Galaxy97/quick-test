const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['code'],
  properties: {
    code: {type: 'string'},
  },
});

module.exports = schema;
