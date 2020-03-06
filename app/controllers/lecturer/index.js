const createError = require('http-errors');

const {lecturer: services} = require('../../services');

module.exports.hello = async (req, res, next) => {
  try {
    const result = services.getHello();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};
// create new lecturer
module.exports.create = async (req, res, next) => {
  try {
    const result = await services.registration(req.body);
    res.status(result.code).json(result);
  } catch (error) {
    next(createError(500, error.message));
  }
};
