const createError = require('http-errors');
const {knex} = require('../db');

module.exports = arr => async (req, res, next) => {
  try {
    const promArr = []; // array for promise all
    arr.forEach(obj => {
      const where = {};
      obj.props.forEach(prop => {
        where[prop.tabProp] = req.query[prop.reqProp] || req.body[prop.reqProp];
      });
      promArr.push(
        knex
          .from(obj.dbName)
          .select()
          .where(where),
      );
    });
    const results = await Promise.all(promArr);
    results.forEach(resProm => {
      if (resProm.length === 0) {
        next(createError(400, 'Bad request'));
      }
    });
  } catch (error) {
    next(createError(500, error.message));
  }
  next();
};
