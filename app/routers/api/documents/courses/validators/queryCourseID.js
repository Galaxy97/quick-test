const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['courseId'],
  properties: {
    courseId: {type: 'number'},
  },
});

module.exports = schema;
