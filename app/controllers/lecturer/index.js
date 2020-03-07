const createError = require('http-errors');

const {lecturer: services} = require('../../services');

module.exports.authorization = async (req, res, next) => {
  try {
    const result = await services.authorization(req.body);
    res.status(result.code).json(result);
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};
