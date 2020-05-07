const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {topics} = require('../../../../controllers/documents');
const questions = require('../questions');
const checkId = require('../../../../utils/exsistInDB');

// get all topics
router.get('/', topics.getAll);

// create new topic
router.post('/', validator(validSchemes.createTopic), topics.create);

// update topic by id
router.put(
  '/',
  queryValitator(validSchemes.queryTopicId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  validator(validSchemes.createTopic),
  topics.editById,
);

// delete topic by id
router.delete(
  '/',
  queryValitator(validSchemes.queryTopicId), // check if request have id
  checkId(validSchemes.schemeCheckId), // check if this id exists in db
  topics.deleteById,
);

router.use('/questions', queryValitator(validSchemes.queryTopicId), questions);

module.exports = router;
