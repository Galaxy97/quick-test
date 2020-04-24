const {knex} = require('../../../db');
const multiChoice = require('./multiChoice');

const getAll = async topictId => {
  // get all questions this cours`s
  const questions = await knex('questions')
    .select()
    .where({topic_id: topictId})
    .leftJoin('multi_choice', 'multi_choice.question_id', 'questions.id');
  return questions;
};

const getById = async id => {
  const [question] = await knex('questions')
    .select()
    .where({id})
    .leftJoin('multi_choice', 'multi_choice.question_id', 'questions.id');
  return question;
};

module.exports = {
  multiChoice,
  getAll,
  getById,
};
