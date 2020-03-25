const router = require('express').Router();
const multi = require('./multiChoice');

router.use('/multichoice', multi);

module.exports = router;
