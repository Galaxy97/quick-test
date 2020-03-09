const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['title'],
  properties: {
    title: {type: 'string'},
  },
});

module.exports = schema;
