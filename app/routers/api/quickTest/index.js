const router = require('express').Router();
const lecturer = require('./lecturer');
const bot = require('./bot');

router.use('/lecturer', lecturer);
router.use('/bot', bot);

module.exports = router;
