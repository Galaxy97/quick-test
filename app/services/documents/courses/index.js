const createError = require('http-errors');

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
  if (course.length > 0) return course[0];
  throw createError(400, 'Bad request');
};

module.exports.editById = async (user, id, body) => {
  // edit cours by id
  const course = await dataBase('Courses')
    .where({id, lecturer_id: user.id})
    .update({title: body.title})
    .returning('id');
  if (course.length > 0) return course[0];
  throw createError(400, 'Bad request');
};

module.exports.deleteById = async (user, id) => {
  // edit cours by id
  await dataBase('Courses')
    .where({id, lecturer_id: user.id})
    .del();
  return true;
};
