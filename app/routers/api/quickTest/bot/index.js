const router = require('express').Router();
const validator = require('../../../../utils/validator');
const validSchemes = require('./validators');
const quickTest = require('../../../../controllers/quickTest');

// add student in test
router.post(
  '/student',
  validator(validSchemes.addStudents),
  quickTest.addStudent,
);

// add student's response on question
router.post(
  '/question',
  validator(validSchemes.setResult),
  quickTest.setResult,
);
// for test
router.get('/domain', quickTest.getDomain);

router.post('/domain', quickTest.setDomain);

module.exports = router;
// const validMesseage = validator(schems.addStudents, data);
// if (validMesseage) throw new Error(validMesseage[0].message);
// quickTest.addStudent(socket, data);
