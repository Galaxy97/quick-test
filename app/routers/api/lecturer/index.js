const router = require('express').Router();
// const validator = require('../../../utils/validator');
// const validSchemes = require('./validators');
const {lecturer} = require('../../../controllers');
// const checkHash = require('../../../utils/checkHash');

router.post(
  '/', // domain.com/api/lecturer
  // validator(validSchemes.authorization), // valid type input data
  // checkHash, // chek correct data
  lecturer.newLecturer, // controller
);

module.exports = router;
