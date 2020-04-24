const {knex} = require('../../../db');

module.exports.getAll = async topictId => {
  // get all subjects this cours`s
  const questions = await knex('questions')
    .select()
    .where({topic_id: topictId})
    .leftJoin('multi_choice', 'multi_choice.question_id', 'questions.id');
  return questions;
};

module.exports.create = async (topicId, body) => {
  // create new question
  const [questionId] = await knex('questions')
    .insert({
      topic_id: topicId,
    })
    .returning('id');
  await knex('multi_choice').insert({
    question_id: questionId,
    title: body.title,
    subtitle: body.subtitle,
    answers: JSON.stringify(body.answers),
  });
  if (questionId) return questionId;
  return false;
};

module.exports.editById = async (topicId, id, body) => {
  // edit topic by id
  const question = await knex('multi_choice')
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
  const res = await knex('multi_choice')
    .where({id, topic_id: topicId})
    .del();
  if (res) return true;
  return false;
};
