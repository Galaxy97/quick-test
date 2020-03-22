const createError = require('http-errors');
const services = require('../../services');

module.exports.getAll = async (req, res, next) => {
  try {
    const subject = await services.documents.subjects.getAll(
      req.query.coursesId,
    );
    res.send({subject});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const subject = await services.documents.subjects.create(
      req.query.coursesId,
      req.body,
    );
    res.json({id: subject});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.editById = async (req, res, next) => {
  try {
    const subject = await services.documents.subjects.editById(
      req.query.coursesId,
      Number(req.query.subjectId),
      req.body,
    );
    if (subject) res.json({id: subject});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const result = await services.documents.subjects.deleteById(
      req.query.coursesId,
      Number(req.query.subjectId),
    );
    if (result) res.json({message: 'successful delete'});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};
