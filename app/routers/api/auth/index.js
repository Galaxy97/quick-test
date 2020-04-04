const router = require('express').Router();
const path = require('path');
// const bot = require('../../../ws/bot');
const lecturer = require('../../../ws/lecturers');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './auth.html'));
});

router.get('/ws', (req, res) => {
  // bot.launch();
  lecturer.sendLecturerMesseage('184dstx', 'asdfasfasds');
  res.send('ok');
});

module.exports = router;
