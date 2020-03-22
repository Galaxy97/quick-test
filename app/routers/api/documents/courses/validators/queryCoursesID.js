const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['coursesId'],
  properties: {
    coursesId: {type: 'number'},
  },
});

module.exports = schema;
