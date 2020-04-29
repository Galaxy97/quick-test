const createError = require('http-errors');
const {knex} = require('../db');

module.exports = arr => async (req, res, next) => {
  try {
    const promArr = [];
    arr.forEach(obj => {
      const where = {};
      obj.props.forEach(prop => {
        where[prop.tabProp] = req.body[prop.reqProp];
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
    console.log(error.message);
    next(createError(500, error.message));
  }
  next();
};
