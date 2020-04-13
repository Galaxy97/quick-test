const dataBase = require('../../db');

module.exports.newLecturer = async () => {
  const [res] = await dataBase('temp_users')
    .insert({})
    .returning('token');
  return res;
};

module.exports.checkToken = async token => {
  const [result] = await dataBase.from('temp_users').where({token});
  return result;
};
module.exports.checkLecturerToken = async token => {
  const [result] = await dataBase.from('lecturers').where({token});
  return result;
};

module.exports.getByTelegramId = async id => {
  const [result] = await dataBase.from('lecturers').where({telegram_id: id});
  return result;
};

module.exports.getByToken = async token => {
  const [result] = await dataBase.from('lecturers').where({token});
  return result;
};

module.exports.registr = async (uuid, user) => {
  await dataBase.from('lecturers').insert({
    first_name: user.first_name,
    last_name: user.last_name,
    telegram_id: user.id,
    token: uuid,
  });
};

module.exports.update = async (uuid, id) => {
  await dataBase
    .from('lecturers')
    .update({
      token: uuid,
    })
    .where({telegram_id: id});
};
