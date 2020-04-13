const router = require('express').Router();
const path = require('path');
// const lecturer = require('../../../controllers/lecturer');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './auth.html'));
});

// router.post('/', lecturer.newLecturer);

module.exports = router;
