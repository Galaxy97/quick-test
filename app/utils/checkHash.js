const createError = require('http-errors');
const crypto = require('crypto');

const config = require('../config');

function buildDataCheckString(data) {
  return Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
}

module.exports = (req, res, next) => {
  const data = req.body;
  const checkHash = data.hash;
  delete data.hash;
  const checkString = buildDataCheckString(data);
  // eslint-disable-next-line no-param-reassign

  const secretKey = crypto
    .createHash('sha256')
    .update(config.telegram.token)
    .digest();

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  if (hmac !== checkHash) next(createError('Invalid data signature'));
  next();
};
