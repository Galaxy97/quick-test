const router = require('express').Router();
const validator = require('../../../../../utils/validator');
const queryValitator = require('../../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {documents} = require('../../../../../controllers');
const checkId = require('../../../../../utils/exsistInDB');

// get all multi question
router.get('/', documents.questions.multiChoice.getAll);

// create multi question
router.post(
  '/',
  validator(validSchemes.multiCreate),
  documents.questions.multiChoice.create,
);

// update multi question by id
router.put(
  '/',
  queryValitator(validSchemes.queryQuestionId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  validator(validSchemes.multiCreate),
  documents.questions.multiChoice.editById,
);

// delete multi question by id
router.delete(
  '/',
  queryValitator(validSchemes.queryQuestionId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  documents.questions.multiChoice.deleteById,
);

module.exports = router;
