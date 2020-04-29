const {knex} = require('../../../db');

module.exports.getAll = async courseID => {
  // get all subjects this cours`s
  const subjects = await knex('subjects')
    .select()
    .where({course_id: courseID});
  return subjects;
};

module.exports.create = async (id, body) => {
  // create new subject
  const subject = await knex('subjects')
    .insert({
      title: body.title,
      course_id: id,
    })
    .returning('id');
  if (subject.length > 0) return subject[0];
  return false;
};

module.exports.editById = async (courseID, id, body) => {
  // edit subject by id
  const subject = await knex('subjects')
    .where({id, course_id: courseID})
    .update({title: body.title})
    .returning('id');
  if (subject.length > 0) return subject[0];
  return false;
};

module.exports.deleteById = async (courseID, id) => {
  // delete subject by id
  const res = await knex('subjects')
    .where({id, course_id: courseID})
    .del();
  if (res) return true;
  return false;
};
