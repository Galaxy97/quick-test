const createError = require('http-errors');

// eslint-disable-next-line consistent-return
const validate = validator => (req, res, next) => {
  if (!validator(req.query)) {
    return next(createError(400, validator.errors));
  }
  next();
};

module.exports = validate;
