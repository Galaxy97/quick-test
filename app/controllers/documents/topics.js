const createError = require('http-errors');
const services = require('../../services');

module.exports.getAll = async (req, res, next) => {
  try {
    const topics = await services.documents.topics.getAll(req.query.subjectId);
    res.send({topics});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const topic = await services.documents.topics.create(
      req.query.subjectId,
      req.body,
    );
    res.json({id: topic});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.editById = async (req, res, next) => {
  try {
    const topic = await services.documents.topics.editById(
      Number(req.query.subjectId),
      Number(req.query.topicId),
      req.body,
    );
    if (topic) res.json({id: topic});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const result = await services.documents.topics.deleteById(
      Number(req.query.subjectId),
      Number(req.query.topicId),
    );
    if (result) res.json({message: 'successful delete'});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};
