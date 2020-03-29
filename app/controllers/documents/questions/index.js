const createError = require('http-errors');
const services = require('../../../services');
const multiChoice = require('./multiChoice');

const getAll = async (req, res, next) => {
  try {
    const questions = await services.documents.questions.getAll(
      req.query.topicId,
    );
    res.send({questions});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports = {
  multiChoice,
  getAll,
};
