const {knex} = require('../../../db');

module.exports.getAll = async user => {
  // get all courses this user`s
  const courses = await knex('courses')
    .select()
    .where({lecturer_id: user.id});
  return courses;
};

module.exports.create = async (user, body) => {
  // create new cours
  const course = await knex('courses')
    .insert({
      title: body.title,
      lecturer_id: user.id,
      description: body.description,
      color_top: body.colorTop,
      color_bottom: body.colorBottom,
    })
    .returning('id');
  if (course.length > 0) return course[0];
  return false;
};

module.exports.editById = async (user, id, body) => {
  // edit cours by id
  const course = await knex('courses')
    .where({id, lecturer_id: user.id})
    .update({
      title: body.title,
      lecturer_id: user.id,
      description: body.description,
      color_top: body.colorTop,
      color_bottom: body.colorBottom,
    })
    .returning('id');
  if (course.length > 0) return course[0];
  return false;
};

module.exports.deleteById = async (user, id) => {
  // edit cours by id
  const res = await knex('courses')
    .where({id, lecturer_id: user.id})
    .del();
  if (res) return true;
  return false;
};
