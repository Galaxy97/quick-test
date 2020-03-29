const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['questionsId', 'title'],
  properties: {
    questionsId: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'integer',
      },
    },
    title: {
      type: 'string',
    },
  },
});

module.exports = schema;
