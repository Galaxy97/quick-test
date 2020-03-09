const dataBase = require('../../../db');

module.exports.getAll = async coursesID => {
  // get all subjects this cours`s
  const subjects = await dataBase('Subjects')
    .select()
    .where({courses_id: coursesID});
  return subjects;
};

module.exports.create = async (id, body) => {
  // create new subject
  const subject = await dataBase('Subjects')
    .insert({
      title: body.title,
      courses_id: id,
    })
    .returning('id');
  if (subject.length > 0) return subject[0];
  return false;
};

module.exports.editById = async (coursesID, id, body) => {
  // edit subject by id
  const subject = await dataBase('Subjects')
    .where({id, courses_id: coursesID})
    .update({title: body.title})
    .returning('id');
  if (subject.length > 0) return subject[0];
  return false;
};

module.exports.deleteById = async (coursesID, id) => {
  // delete subject by id
  const res = await dataBase('Subjects')
    .where({id, courses_id: coursesID})
    .del();
  if (res) return true;
  return false;
};
