const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['title', 'subtitle', 'answers'],
  properties: {
    title: {type: 'string'},
    subtitle: {type: 'string'},
    answers: {
      type: 'array',
      items: [
        {
          type: 'object',
          required: ['id', 'title', 'answer'],
          properties: {
            id: {type: 'number'},
            title: {type: 'string'},
            answer: {type: 'boolean'},
          },
        },
      ],
    },
  },
});

module.exports = schema;
