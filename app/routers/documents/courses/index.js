const router = require('express').Router();
const validator = require('../../../utils/validator');
const validSchemes = require('./validators');
const {documents} = require('../../../controllers');

router.get('/', documents.courses.getAll); // get all courses this user
// router.get('/courses/:id', checkUser, documents.courses.getbyId); // get all courses this user

router.post('/', validator(validSchemes.createCourse), documents.courses.new); // create new couses

router.put(
  '/:id',
  validator(validSchemes.editCourse),
  documents.courses.editById,
); // edit couses by id

// router.delete('/courses', checkUser, documents.courses.deleteAll); // delete all couses
router.delete('/:id', documents.courses.deleteById); // delete courses by id

module.exports = router;
