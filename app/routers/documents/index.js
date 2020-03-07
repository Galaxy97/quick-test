const router = require('express').Router();
const courses = require('./courses');

router.use('/courses', courses);

module.exports = router;
