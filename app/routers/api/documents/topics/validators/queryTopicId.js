const ajv = require('ajv')({coerceTypes: true});

const schema = ajv.compile({
  type: 'object',
  required: ['topicId'],
  properties: {
    topicId: {type: 'number'},
  },
});

module.exports = schema;
