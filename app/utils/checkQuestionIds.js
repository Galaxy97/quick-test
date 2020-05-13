const createError = require('http-errors');
const {knex} = require('../db');

module.exports = async (req, res, next) => {
  const result = await knex
    .from('questions')
    .select('id')
    .whereIn('id', req.body.questionsId);
  if (req.body.questionsId.length !== result.length) {
    next(createError(400, `Bad request onde of id is not exsist`));
  }
  next();
};
