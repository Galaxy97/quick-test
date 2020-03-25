const dataBase = require('../../../db');

module.exports.getAll = async topictId => {
  // get all subjects this cours`s
  const questions = await dataBase('MultiChoice')
    .select()
    .where({topic_id: topictId});
  return questions;
};

module.exports.create = async (topicId, body) => {
  // create new subject
  const question = await dataBase('MultiChoice')
    .insert({
      title: body.title,
      subtitle: body.subtitle,
      answers: JSON.stringify(body.answers),
      topic_id: topicId,
    })
    .returning('id');
  if (question.length > 0) return question[0];
  return false;
};

module.exports.editById = async (topicId, id, body) => {
  // edit topic by id
  const question = await dataBase('MultiChoice')
    .where({id, topic_id: topicId})
    .update({
      title: body.title,
      subtitle: body.subtitle,
      answers: JSON.stringify(body.answers),
      topic_id: topicId,
    })
    .returning('id');
  if (question.length > 0) return question[0];
  return false;
};

module.exports.deleteById = async (topicId, id) => {
  // delete subject by id
  const res = await dataBase('MultiChoice')
    .where({id, topic_id: topicId})
    .del();
  if (res) return true;
  return false;
};
