const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');

require('express-async-errors');

const config = require('./config');
const api = require('./routers/api');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', api);
app.use((req, res, next) => {
  next(createError(404, `Page Not Found ${req.path}`));
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  const errMessage = {status: error.status, message: error.message};
  if (config.server.NODE_ENV === 'development') {
    errMessage.stack = error.stack;
    [errMessage.body] = error;
  }
  res.json({errMessage});
});

console.log(`
***********************************************
******* Application is ready for usage ********
***********************************************
***********************************************
`);

module.exports = app;
