const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');

const routers = require('./routers');

// db connection
require('./db');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', routers);

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
  });
});

console.log(`
***********************************************
*********  Server is ready for usage  *********
***********************************************
***********************************************
`);

module.exports = app;
