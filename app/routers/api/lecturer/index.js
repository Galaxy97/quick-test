const router = require('express').Router();
const validator = require('../../../utils/validator');
const validSchemes = require('./validators');
const {lecturer} = require('../../../controllers');

router.post('/', lecturer.newLecturer);

router.post('/check', validator(validSchemes.check), lecturer.checkLecturer);

module.exports = router;
