const dataBase = require('../../../db');

module.exports.getAll = async user => {
  // get all courses this user`s
  const courses = await dataBase('Courses')
    .select()
    .where({lecturer_id: user.id});
  return courses;
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
