const dataBase = require('../../../db');

module.exports.getAll = async subjectId => {
  // get all subjects this cours`s
  const topics = await dataBase('Topics')
    .select()
    .where({subjects_id: subjectId});
  return topics;
};

module.exports.create = async (id, body) => {
  // create new subject
  const subject = await dataBase('Topics')
    .insert({
      title: body.title,
      subjects_id: id,
    })
    .returning('id');
  if (subject.length > 0) return subject[0];
  return false;
};

module.exports.editById = async (subjectID, id, body) => {
  // edit topic by id
  const topic = await dataBase('Topics')
    .where({id, subjects_id: subjectID})
    .update({title: body.title})
    .returning('id');
  if (topic.length > 0) return topic[0];
  return false;
};

module.exports.deleteById = async (subjectID, id) => {
  // delete subject by id
  const res = await dataBase('Topics')
    .where({id, subjects_id: subjectID})
    .del();
  if (res) return true;
  return false;
};
