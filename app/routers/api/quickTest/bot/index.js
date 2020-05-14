const router = require('express').Router();
const validator = require('../../../../utils/validator');
const validSchemes = require('./validators');
const quickTest = require('../../../../controllers/quickTest');
const checkData = require('../../../../utils/exsistInDB');

// add student in test
router.post(
  '/student',
  validator(validSchemes.addStudents),
  quickTest.addStudent,
);

// add student's response on question
router.post(
  '/question',
  checkData([
    {
      dbName: 'test_participants',
      props: [
        {tabProp: 'test_id', reqProp: 'test_id'},
        {tabProp: 'telegram_id', reqProp: 'participant_id'},
      ],
    },
    {
      dbName: 'test_questions',
      props: [
        {tabProp: 'test_id', reqProp: 'test_id'},
        {tabProp: 'question_id', reqProp: 'question_id'},
      ],
    },
  ]),
  validator(validSchemes.setResult),
  quickTest.setResult,
);

module.exports = router;
