const router = require('express').Router();
const validator = require('../../../../utils/validator');
const validSchemes = require('./validators');
const quickTest = require('../../../../controllers/quickTest');
const checkQuestionsId = require('../../../../utils/checkQuestionIds');

// create test
router.post(
  '/',
  validator(validSchemes.createTest),
  checkQuestionsId,
  quickTest.createTest,
);

module.exports = router;
