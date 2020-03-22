const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['coursesId', 'subjectId', 'topicId'],
  properties: {
    coursesId: {type: 'number'},
    subjectId: {type: 'number'},
    topicId: {type: 'number'},
  },
});

module.exports = schema;
