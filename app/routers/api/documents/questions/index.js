const router = require('express').Router();
const {questions} = require('../../../../controllers/documents');

const multi = require('./multiChoice');

router.get('/', questions.getAll);

router.use('/multichoice', multi);

module.exports = router;
