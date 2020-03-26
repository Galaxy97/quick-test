const createError = require('http-errors');
const knex = require('../db');

// eslint-disable-next-line consistent-return
module.exports = (dbName, prName, value) => async (req, res, next) => {
  const value2 = req.query[value];
  const result = await knex
    .from(dbName)
    .select(prName)
    .where(prName, value2);
  if (!result[0])
    return next(
      createError(400, `Bad request, ${prName} = ${value2} is not exsist`),
    );
  next();
};
