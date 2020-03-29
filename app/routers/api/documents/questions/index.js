const router = require('express').Router();
const documents = require('../../../../controllers/documents');

const multi = require('./multiChoice');

router.get('/', documents.questions.getAll);

router.use('/multichoice', multi);

module.exports = router;
