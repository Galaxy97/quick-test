const router = require('express').Router();
const path = require('path');
const bot = require('../../../ws/bot');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './auth.html'));
});

router.get('/ws', (req, res) => {
  bot.launch();
  res.send('ok');
});

module.exports = router;
