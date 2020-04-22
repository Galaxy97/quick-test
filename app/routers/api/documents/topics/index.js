const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {documents} = require('../../../../controllers');
const questions = require('../questions');
const checkId = require('../../../../utils/exsistInDB');

router.get('/', documents.topics.getAll); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post('/', validator(validSchemes.createTopic), documents.topics.create); // create new topic

router.put(
  '/',
  queryValitator(validSchemes.queryTopicId),
  checkId([
    {
      dbName: 'topics',
      props: [{tabProp: 'id', reqProp: 'topicId'}],
    },
  ]),
  validator(validSchemes.createTopic),
  documents.topics.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.queryTopicId),
  checkId([
    {
      dbName: 'topics',
      props: [{tabProp: 'id', reqProp: 'topicId'}],
    },
  ]),
  documents.topics.deleteById,
); // get all courses this user

router.use('/questions', queryValitator(validSchemes.queryTopicId), questions);

module.exports = router;
