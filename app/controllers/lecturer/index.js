const createError = require('http-errors');

const {lecturer: services} = require('../../services');

module.exports.newLecturer = async (req, res, next) => {
  try {
    const token = await services.newLecturer();
    res.json({token});
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};

// eslint-disable-next-line consistent-return
module.exports.checkLecturer = async (req, res, next) => {
  try {
    const exsistUUID = await services.checkToken(req.body.uuid);
    if (!exsistUUID) {
      res.status(400).send('uuid is not exists');
      return false;
    }
    const lecturer = await services.getByToken(req.body.uuid);
    if (!lecturer) {
      res.status(400).send('lecturer is not valid');
      return false;
    }
    res.json({message: 'valid', lecturer});
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.auth = async (uuid, user) => {
  try {
    // check uuid
    const exsistUUID = await services.checkToken(uuid);
    if (!exsistUUID) {
      return false;
    }
    // get user by telegram_id
    const lecturer = await services.getByTelegramId(user.id);
    // if telegram_id is not exsist write it
    if (lecturer) {
      await services.update(uuid, lecturer.telegram_id);
      return true;
    }
    // else get this user and write new token for him
    await services.registr(uuid, user);
    return true;
  } catch (error) {
    // console.log(error.message);
    return false;
  }
};
