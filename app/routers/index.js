const router = require('express').Router();
const checkUser = require('../utils/checkUser');

router.use('/lecturer', require('./lecturer'));
router.use('/documents', checkUser, require('./documents'));

module.exports = router;
