const createError = require('http-errors');
const services = require('../services');

module.exports = async (req, res, next) => {
  const userArr = await services.lecturer.checkLecturerToken(
    req.headers['x-auth-token'],
  );
  if (!userArr || userArr.length === 0) {
    next(createError(401, 'Unauthorized'));
  }
  req.user = userArr;
  next();
};
