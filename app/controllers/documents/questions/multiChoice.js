const createError = require('http-errors');
const services = require('../../../services');

module.exports.getAll = async (req, res, next) => {
  try {
    const questions = await services.documents.questions.multiChoice.getAll(
      req.query.topicId,
    );
    res.send({questions});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const question = await services.documents.questions.multiChoice.create(
      req.query.topicId,
      req.body,
    );
    res.json({id: question});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.editById = async (req, res, next) => {
  try {
    const question = await services.documents.questions.multiChoice.editById(
      Number(req.query.topicId),
      Number(req.query.questionId),
      req.body,
    );
    if (question) res.json({id: question});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const result = await services.documents.questions.multiChoice.deleteById(
      Number(req.query.topicId),
      Number(req.query.questionId),
    );
    if (result) res.json({message: 'successful delete'});
    else next(createError(400, 'Bad request'));
  } catch (error) {
    next(createError(500, error.message));
  }
};
