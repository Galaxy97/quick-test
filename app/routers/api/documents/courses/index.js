const router = require('express').Router();
const validator = require('../../../../utils/validator');
const queryValitator = require('../../../../utils/queryValidator');
const validSchemes = require('./validators');
const {courses} = require('../../../../controllers/documents');
const subjects = require('../subjetcs'); // routes for subject in courses

// get all courses this user
router.get('/', courses.getAll);

// create new couses
router.post('/', validator(validSchemes.createCourse), courses.create);

// edit couses by id
router.put(
  '/',
  queryValitator(validSchemes.queryCourseId), // request must have course_id
  validator(validSchemes.createCourse),
  courses.editById,
);

// delete courses by id
router.delete(
  '/',
  queryValitator(validSchemes.queryCourseId), // request must have course_id
  courses.deleteById,
);

router.use('/subjects', queryValitator(validSchemes.queryCourseId), subjects); // handle subjects valid in the next handle

module.exports = router;
