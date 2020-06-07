const axios = require('axios');
const config = require('../../config');
const logger = require('../../utils/logger');

module.exports.launchTest = async msg => {
  try {
    await axios.post(`${config.telegram.BOT_URL}/quicktest/launchtest`, msg, {
      headers: {
        'X-Auth-Token': config.telegram.BOT_TOKEN,
      },
    });
    return true;
  } catch (error) {
    logger.error('error with launch test message to bot', error);
  }
  return false;
};

module.exports.sendQuestion = async msg => {
  try {
    await axios.post(`${config.telegram.BOT_URL}/quicktest/question`, msg, {
      headers: {
        'X-Auth-Token': config.telegram.BOT_TOKEN,
      },
    });
    return true;
  } catch (error) {
    logger.error('error with send question to bot', error);
  }
  return false;
};

module.exports.partWithoutAnswer = async msg => {
  try {
    await axios.post(
      `${config.telegram.BOT_URL}/quicktest/question/noresult`,
      msg,
      {
        headers: {
          'X-Auth-Token': config.telegram.BOT_TOKEN,
        },
      },
    );
    return true;
  } catch (error) {
    logger.error('error with send message part without answer to bot', error);
  }
  return false;
};

module.exports.sendResOnQuestion = async msg => {
  try {
    await axios.post(
      `${config.telegram.BOT_URL}/quicktest/question/result`,
      msg,
      {
        headers: {
          'X-Auth-Token': config.telegram.BOT_TOKEN,
        },
      },
    );
    return true;
  } catch (error) {
    logger.error('error with send result on question to bot', error);
  }
  return false;
};
module.exports.sendEndQuestion = async msg => {
  try {
    await axios.post(`${config.telegram.BOT_URL}/quicktest/question/end`, msg, {
      headers: {
        'X-Auth-Token': config.telegram.BOT_TOKEN,
      },
    });
    return true;
  } catch (error) {
    logger.error('error with send end question to bot', error);
  }
  return false;
};
