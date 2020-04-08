const ajv = require('ajv')();

const schema = ajv.compile({
  type: 'object',
  required: ['test_id', 'participant_id', 'question_id', 'answer'],
  properties: {
    test_id: {type: 'number'},
    participant_id: {type: 'number'},
    question_id: {type: 'number'},
    answer: {type: 'array'},
  },
});

module.exports = schema;
