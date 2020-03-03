const {lecturer: services} = require('../services');

module.exports.hello = async (req, res, next) => {
  try {
    const result = services.getHello();
    res.send(result);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500);
    next(e);
  }
};
