const router = require('express').Router();
const validator = require('../../utils/validator');
const validSchemes = require('./validators');
const {lecturer} = require('../../controllers');
const checkHash = require('../../utils/checkHash');

router.get('/', lecturer.hello);
router.post(
  '/',
  validator(validSchemes.registration),
  checkHash,
  lecturer.create,
); // registration

module.exports = router;
