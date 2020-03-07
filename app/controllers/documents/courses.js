const createError = require('http-errors');
const services = require('../../services');

module.exports.getAll = async (req, res, next) => {
  try {
    const courses = await services.documents.courses.getAll(req.user);
    res.send({courses});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.new = async (req, res, next) => {
  try {
    const course = await services.documents.courses.new(req.user, req.body);
    res.json({id: course});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.editById = async (req, res, next) => {
  try {
    const course = await services.documents.courses.editById(
      req.user,
      Number(req.params.id),
      req.body,
    );
    res.json({id: course});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    await services.documents.courses.deleteById(
      req.user,
      Number(req.params.id),
    );
    res.json({message: 'successful delete'});
  } catch (error) {
    next(createError(500, error.message));
  }
};
