const axios = require('axios');
const config = require('../../config');

module.exports.launchTest = async msg => {
  try {
    const result = await axios.post(
      `${config.telegram.BOT_URL}/quicktest/launchtest`,
      msg,
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendQuestion = async msg => {
  try {
    const result = await axios.post(
      `${config.telegram.BOT_URL}/quicktest/question`,
      msg,
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
module.exports.partWithoutAnswer = async msg => {
  try {
    const result = await axios.post(
      `${config.telegram.BOT_URL}/quicktest/question/result`,
      msg,
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
