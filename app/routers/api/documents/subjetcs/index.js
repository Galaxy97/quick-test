const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const coursesSchemes = require('../courses/validators');
const {documents} = require('../../../../controllers');

router.get(
  '/',
  queryValitator(coursesSchemes.queryCoursesId),
  documents.subjects.getAll,
); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post(
  '/',
  validator(validSchemes.createSubjects),
  documents.subjects.create,
); // create new couses

router.put(
  '/',
  queryValitator(validSchemes.querySubjectId),
  validator(validSchemes.createSubjects),
  documents.subjects.editById,
); // create new couses

router.delete(
  '/',
  queryValitator(validSchemes.querySubjectId),
  documents.subjects.deleteById,
); // get all courses this user

module.exports = router;
