const express = require('express');
const bodyParser = require('body-parser');

// db connection
require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

// test
app.get('/', (req, res) => {
  res.send('ok');
});

app.use((req, res, next) => {
  const err = new Error(`Not Found ${req.path}`);
  err.status = 404;
  next(err);
});

// eslint-disable-next-line consistent-return
app.use((error, req, res, next) => {
  if (error.errors) {
    return res.status(400).json({
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
  next(error);
});

console.log(`
***********************************************
*********  Server is ready for usage  *********
***********************************************
***********************************************
`);

module.exports = app;
