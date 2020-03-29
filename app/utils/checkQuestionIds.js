const createError = require('http-errors');
const knex = require('../db');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const result = await knex
    .from('questions')
    .select('id')
    .whereIn('id', req.body.questionsId);
  if (req.body.questionsId.length !== result.length)
    return next(createError(400, `Bad request onde of id is not exsist`));
  next();
};
