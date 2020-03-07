const dataBase = require('../../../db');

module.exports.getAll = () => {
  // get all courses this user`s
};
module.exports.new = async (user, body) => {
  // create new cours
  const course = await dataBase('Courses')
    .insert({
      title: body.title,
      lecturer_id: user.id,
    })
    .returning('id');
  return course[0];
};
