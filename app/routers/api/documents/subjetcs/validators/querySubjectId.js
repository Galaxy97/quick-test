const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['coursesId, subjectId'],
  properties: {
    coursesId: {type: 'number'},
    subjectId: {type: 'number'},
  },
});

module.exports = schema;
