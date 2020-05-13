const createError = require('http-errors');

const validate = validator => (req, res, next) => {
  if (!validator(req.body)) {
    next(createError(400, validator.errors));
  }
  next();
};

module.exports = validate;
