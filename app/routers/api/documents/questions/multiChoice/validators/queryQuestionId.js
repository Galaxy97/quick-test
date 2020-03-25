const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['questionId'],
  properties: {
    questionId: {type: 'number'},
  },
});

module.exports = schema;
