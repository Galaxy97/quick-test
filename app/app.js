const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');

const api = require('./routers/api');

const app = express();
app.use(helmet());
app.use(morgan('dev'));

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
  res.json({
    status: error.status,
    message: error.message,
    // when node_env === delelopment
    stack: error.stack,
    body: error[0],
  });
});

console.log(`
***********************************************
******* Application is ready for usage ********
***********************************************
***********************************************
`);

module.exports = app;
