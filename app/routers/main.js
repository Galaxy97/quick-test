const router = require('express').Router();
const {createReadStream} = require('fs');

router.get('/', (req, res) => {
  createReadStream('app/routers/index.html').pipe(res);
});

module.exports = router;
