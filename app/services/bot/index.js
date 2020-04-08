const axios = require('axios');

module.exports.launchTest = async msg => {
  try {
    const result = await axios.post(
      'http://127.0.0.1:3001/quicktest/launchtest',
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
      'http://127.0.0.1:3001/quicktest/question',
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
      'http://127.0.0.1:3001/quicktest/question/result',
      msg,
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
