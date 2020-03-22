const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const subjectsSchemes = require('../subjetcs/validators');
const {documents} = require('../../../../controllers');

router.get(
  '/',
  queryValitator(subjectsSchemes.querySubjectId),
  documents.topics.getAll,
); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post(
  '/',
  queryValitator(subjectsSchemes.querySubjectId),
  validator(validSchemes.createTopic),
  documents.topics.create,
); // create new topic

router.put(
  '/',
  queryValitator(validSchemes.queryTopicId),
  validator(validSchemes.createTopic),
  documents.topics.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.queryTopicId),
  documents.topics.deleteById,
); // get all courses this user

module.exports = router;
