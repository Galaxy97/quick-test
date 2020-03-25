const router = require('express').Router();
const validator = require('../../../../../utils/validator');
const queryValitator = require('../../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {documents} = require('../../../../../controllers');

router.get(
  '/',
  queryValitator(validSchemes.queryQuestionId),
  documents.questions.multiChoice.getAll,
); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post(
  '/',
  validator(validSchemes.multiCreate),
  documents.questions.multiChoice.create,
); // create new topic

router.put(
  '/',
  queryValitator(validSchemes.queryQuestionId),
  validator(validSchemes.multiCreate),
  documents.questions.multiChoice.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.queryQuestionId),
  documents.questions.multiChoice.deleteById,
); // get all courses this user

module.exports = router;
