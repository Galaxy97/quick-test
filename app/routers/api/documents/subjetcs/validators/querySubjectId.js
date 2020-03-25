const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['subjectId'],
  properties: {
    subjectId: {type: 'number'},
  },
});

module.exports = schema;
