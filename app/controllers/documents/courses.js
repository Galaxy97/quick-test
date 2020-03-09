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

module.exports.create = async (req, res, next) => {
  try {
    const course = await services.documents.courses.create(req.user, req.body);
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
    if (course) res.json({id: course});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const result = await services.documents.courses.deleteById(
      req.user,
      Number(req.params.id),
    );
    if (result) res.json({message: 'successful delete'});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};
