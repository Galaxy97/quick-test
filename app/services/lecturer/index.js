// const dataBase = require('../../db');

module.exports.getHello = () => {
  return 'hello from services';
};

module.exports.registration = body => {
  // const {first_name, last_name, password, telegram_id} = body;
  console.log(body);
  const result = {
    body: {
      token: 'asdasdasdasdas',
    },
  };
  return {code: 200, result: result.body};
};
