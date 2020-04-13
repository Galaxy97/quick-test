const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['title', 'description', 'colorTop', 'colorBottom'],
  properties: {
    title: {type: 'string'},
    description: {type: 'string'},
    colorTop: {type: 'number'},
    colorBottom: {type: 'number'},
  },
});

module.exports = schema;
