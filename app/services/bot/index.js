const axios = require('axios');
const config = require('../../config');

module.exports.launchTest = async msg => {
  try {
    await axios.post(`${config.telegram.BOT_URL}/quicktest/launchtest`, msg, {
      headers: {
        'X-Auth-Token': config.telegram.BOT_TOKEN,
      },
    });
    return true;
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
  }
  return false;
};
