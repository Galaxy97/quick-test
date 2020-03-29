const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {documents} = require('../../../../controllers');
const topics = require('../topics');
const checkId = require('../../../../utils/exsistIdinDB');

router.get('/', documents.subjects.getAll); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post(
  '/',
  validator(validSchemes.createSubject),
  documents.subjects.create,
); // create new couses

router.put(
  '/',
  queryValitator(validSchemes.querySubjectId),
  checkId('subjects', 'id', 'subjectId'),
  validator(validSchemes.createSubject),
  documents.subjects.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.querySubjectId),
  checkId('subjects', 'id', 'subjectId'),
  documents.subjects.deleteById,
); // get all courses this user

router.use('/topics', queryValitator(validSchemes.querySubjectId), topics);

module.exports = router;
