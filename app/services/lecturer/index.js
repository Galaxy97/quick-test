const dataBase = require('../../db');

// eslint-disable-next-line consistent-return
module.exports.authorization = async body => {
  try {
    const knexRequest = {};
    const result = {};
    if (body.token) knexRequest.token = body.token;
    else knexRequest.telegram_id = body.id;
    const lecturer = await dataBase
      .select('token')
      .from('Lecturers')
      .where(knexRequest);
    if (lecturer.length === 0) {
      // registr this user
      const res = await dataBase('Lecturers')
        .insert({
          first_name: body.first_name,
          last_name: body.last_name,
          telegram_id: body.id,
        })
        .returning('token');
      // eslint-disable-next-line prefer-destructuring
      result.token = res[0].token;
    } else {
      // user has looked
      // eslint-disable-next-line prefer-destructuring
      result.token = lecturer[0].token;
    }
    return {code: 200, result};
  } catch (error) {
    console.log(error);
    throw error;
  }
};
