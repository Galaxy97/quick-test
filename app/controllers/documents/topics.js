const createError = require('http-errors');
const services = require('../../services');

// get all topics in subject
module.exports.getAll = async (req, res, next) => {
  try {
    const topics = await services.documents.topics.getAll(req.query.subjectId);
    res.json({topics});
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
    res.json({message: 'successful create', id: topic});
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
    if (topic) res.json({message: 'successful update', id: topic});
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
