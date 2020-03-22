const router = require('express').Router();
const checkUser = require('../../utils/checkUser');
const lecturer = require('./lecturer');
const documents = require('./documents');

router.use('/lecturer', lecturer);
router.use('/documents', checkUser, documents);

module.exports = router;
