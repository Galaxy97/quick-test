const createError = require('http-errors');
const services = require('../../../services');
const multiChoice = require('./multiChoice');

// get all questions this user
const getAll = async (req, res, next) => {
  try {
    const questions = await services.documents.questions.getAll(
      req.query.topicId,
    );
    res.json({questions});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports = {
  multiChoice,
  getAll,
};
