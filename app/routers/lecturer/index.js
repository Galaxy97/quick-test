const router = require('express').Router();
const validator = require('../../utils/validator');
const validSchemes = require('./validators');
const {lecturer} = require('../../controllers');

router.get('/', lecturer.hello);
router.post('/', validator(validSchemes.registration), lecturer.create); // registration

module.exports = router;
