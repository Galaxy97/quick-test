const createError = require('http-errors');

const {lecturer: services} = require('../../services');

module.exports.newLecturer = async (req, res, next) => {
  try {
    const result = await services.newLecturer();
    res.json(result);
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};
