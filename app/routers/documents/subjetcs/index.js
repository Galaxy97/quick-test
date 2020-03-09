const router = require('express').Router();
const validator = require('../../../utils/validator');
const validSchemes = require('./validators');
const {documents} = require('../../../controllers');

router.get('/', documents.subjects.getAll); // get all courses this user

// router.get('/:id', (req, res) => {
//   res.send(`get ${req.params.id} subjects from ${req.coursesID}`);
// }); // get all courses this user

router.post(
  '/',
  validator(validSchemes.createSubjects),
  documents.subjects.create,
); // create new couses

router.put(
  '/:id',
  validator(validSchemes.createSubjects),
  documents.subjects.editById,
); // create new couses

router.delete('/:id', documents.subjects.deleteById); // get all courses this user

module.exports = router;
