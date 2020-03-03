const router = require('express').Router();

const {lecturer} = require('../controllers');

router.get('/', lecturer.hello);

module.exports = router;
