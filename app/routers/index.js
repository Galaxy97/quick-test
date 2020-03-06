const router = require('express').Router();

router.use('/', require('./main'));
router.use('/lecturer', require('./lecturer'));

module.exports = router;
