const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['title', 'description'],
  properties: {
    title: {type: 'string'},
    description: {type: 'string'},
  },
});

module.exports = schema;
