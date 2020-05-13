const router = require('express').Router();
const checkUser = require('../../utils/checkUser'); // middleware whether user exists in db
const lecturer = require('./lecturer');
const documents = require('./documents');
const quickTest = require('./quickTest');

router.use('/lecturer', lecturer);
router.use('/documents', checkUser, documents);
router.use('/quicktest', checkUser, quickTest);

module.exports = router;
