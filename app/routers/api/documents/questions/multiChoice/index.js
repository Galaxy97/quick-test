const router = require('express').Router();
const validator = require('../../../../../utils/validator');
const queryValitator = require('../../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {documents} = require('../../../../../controllers');
const checkId = require('../../../../../utils/exsistInDB');

router.get('/', documents.questions.multiChoice.getAll); // get all courses this user

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
  checkId([
    {
      dbName: 'multi_choice',
      props: [{tabProp: 'id', reqProp: 'questionId'}],
    },
  ]),
  validator(validSchemes.multiCreate),
  documents.questions.multiChoice.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.queryQuestionId),
  checkId([
    {
      dbName: 'multi_choice',
      props: [{tabProp: 'id', reqProp: 'questionId'}],
    },
  ]),
  documents.questions.multiChoice.deleteById,
); // get all courses this user

module.exports = router;
