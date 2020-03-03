const router = require('express').Router();

router.use('/lecturer', require('./lecturer'));

module.exports = router;
