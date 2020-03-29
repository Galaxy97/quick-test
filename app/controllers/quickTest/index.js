const createError = require('http-errors');
const services = require('../../services');

module.exports.createTest = async (req, res, next) => {
  try {
    const code = await services.quickTest.create({
      lecturerId: req.user.id,
      questionsId: req.body.questionsId,
      title: req.body.title,
    });
    res.json({code});
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};
