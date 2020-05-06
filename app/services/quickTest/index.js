/* eslint-disable no-plusplus */
const {promisify} = require('util');
const {knex, redis} = require('../../db');

const getAsync = promisify(redis.get).bind(redis);
const config = require('../../config');

const makeCode = () => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.create = async ({lecturerId, questionsId, title}) => {
  // create new cours
  // create unique code
  let check;
  let code;
  do {
    code = makeCode();
    // eslint-disable-next-line no-await-in-loop
    [check] = await knex('tests')
      .select('code')
      .where({code});
  } while (check);
  // write test data test
  const [testId] = await knex('tests')
    .insert({
      lecturer_id: lecturerId,
      title,
      is_open: true,
      code,
    })
    .returning('id');
  const tq = questionsId.map(id => {
    return {test_id: testId, question_id: id};
  });
  await knex('test_questions').insert(tq);

  if (testId) return code;
  return false;
};

module.exports.checkTestCode = async code => {
  const [test] = await knex('tests')
    .select(
      'id',
      'title',
      knex.raw('COUNT(test_questions.test_id) :: integer as count'),
    )
    .innerJoin('test_questions', 'test_questions.test_id', 'tests.id')
    .where({code, is_open: true})
    .groupBy('id');
  return test;
};

module.exports.getTestByCode = async code => {
  const [test] = await knex('tests')
    .select(
      'id',
      'lecturer_id',
      'code',
      'title',
      knex.raw('COUNT(test_questions.test_id) :: integer as count'),
    )
    .innerJoin('test_questions', 'test_questions.test_id', 'tests.id')
    .where({code, is_open: true})
    .groupBy('id');
  return test;
};
module.exports.getTestById = async id => {
  const [test] = await knex('tests')
    .select()
    .where({id});
  return test;
};

module.exports.checkStudent = async student => {
  try {
    const [participant] = await knex('participants')
      .select('telegram_id')
      .where({telegram_id: student.participant_id});
    if (!participant) {
      await knex('participants').insert({
        telegram_id: student.participant_id,
        first_name: student.first_name,
        last_name: student.last_name,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
module.exports.addStudentInTest = async (telegramId, testId) => {
  const rows = await knex('test_participants').where({
    test_id: testId,
    telegram_id: telegramId,
  });
  if (rows.length === 0) {
    await knex('test_participants').insert({
      test_id: testId,
      telegram_id: telegramId,
    });
  } else return true;
};

module.exports.checkSocketId = async (socketId, code) => {
  const [test] = await knex('tests')
    .select('id')
    .where({code});
  const [socket] = await knex('test_lecturers')
    .select()
    .where({test_id: test.id});
  if (!socket) {
    await knex('test_lecturers').insert({
      test_id: test.id,
      socket_id: socketId,
    });
  } else {
    await knex('test_lecturers')
      .update({
        test_id: test.id,
        socket_id: socketId,
      })
      .where({test_id: test.id});
  }
};

module.exports.getLecturerId = async testId => {
  const [test] = await knex('test_lecturers')
    .select('socket_id')
    .where({test_id: testId});
  return test.socket_id;
};

// eslint-disable-next-line consistent-return
module.exports.getParticipants = async testId => {
  try {
    const participants = await knex('test_participants')
      .select('telegram_id')
      .where({test_id: testId});
    const participantsID = [];
    participants.forEach(part => {
      participantsID.push(part.telegram_id);
    });
    return participantsID;
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
module.exports.closeTest = async testId => {
  try {
    await knex('tests')
      .update({is_open: false})
      .where({id: testId});
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
module.exports.getQuestionsId = async testId => {
  try {
    const ids = await knex('test_questions')
      .select('question_id')
      .where({test_id: testId});
    console.log(ids);
    return ids;
  } catch (error) {
    console.log(error);
  }
};

module.exports.setResult = async ({
  testId,
  participantId,
  questionId,
  answer,
}) => {
  const [record] = await knex('test_results').where({
    test_id: testId,
    telegram_id: participantId,
    question_id: questionId,
  });
  if (!record) {
    await knex('test_results').insert({
      test_id: testId,
      telegram_id: participantId,
      question_id: questionId,
      participant_answers: JSON.stringify(answer),
    });
    return true;
  }
  return false;
};

module.exports.getResult = async (testId, questionId) => {
  const sel = {
    test_id: testId,
  };
  if (questionId) sel.question_id = questionId;
  const records = await knex('test_results')
    .select('telegram_id', 'participant_answers', 'question_id')
    .where(sel);
  return records;
};

module.exports.lookingPartWithOutAnswer = async (
  testId,
  questionId,
  participants,
) => {
  let partWithAnswer = await knex('test_results')
    .select('telegram_id')
    .where({test_id: testId, question_id: questionId});
  partWithAnswer = partWithAnswer.map(obj => obj.telegram_id);
  const withOutAnswer = [];
  participants.forEach(id => {
    if (partWithAnswer.indexOf(id) === -1) {
      withOutAnswer.push(id);
    }
  });
  return withOutAnswer;
};

module.exports.saveInRedis = async (id, data) => {
  try {
    await redis.set(id, JSON.stringify(data));
  } catch (error) {
    console.log(error.message);
    return false;
  }
  return true;
};

module.exports.getFromRedis = async id => {
  try {
    let data = await getAsync(id);
    data = JSON.parse(data);
    return data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
module.exports.deleteFromRedis = async id => {
  try {
    await redis.del(id);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

function isEqualArrays(a, b) {
  // if length is not equal
  if (a.length !== b.length) {
    return false;
  }
  // comapring each element of array
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function sortAndCheckAnswers(data, test) {
  // write in questions write answers id in array,
  // right answer can be more than one
  const questionsAns = {};
  test.questions.forEach(question => {
    const rightAnswId = [];
    question.answers.forEach(answ => {
      if (answ.answer === true) {
        rightAnswId.push(answ.id);
      }
    });
    questionsAns[question.id] = {
      rightAnswId,
    };
  });
  const individuals = {};
  const questions = {};
  data.forEach(answer => {
    let isRight;
    if (answer.participant_answers === false) isRight = false;
    else {
      isRight = isEqualArrays(
        answer.participant_answers,
        questionsAns[answer.question_id].rightAnswId,
      ); // true or false
    }
    // write by users answers
    individuals[answer.telegram_id] = individuals[answer.telegram_id] || [];
    individuals[answer.telegram_id].push({
      question_id: answer.question_id,
      answer: isRight,
    });
    // write by questions
    questions[answer.question_id] = questions[answer.question_id] || [];
    questions[answer.question_id].push({
      telegram_id: answer.telegram_id,
      answer: isRight,
    });
  });
  return {
    individuals,
    questions,
  };
}

module.exports.calculateStatistics = (data, test) => {
  const answers = sortAndCheckAnswers(data, test); // individuals and questions

  Object.keys(answers.individuals).forEach(participantId => {
    let trueAnsw = 0;
    answers.individuals[participantId].forEach(question => {
      if (question.answer) trueAnsw++;
    });
    answers.individuals[participantId] = {
      all: answers.individuals[participantId].length,
      true: trueAnsw,
      false: answers.individuals[participantId].length - trueAnsw,
      percent: Math.round(
        (trueAnsw / answers.individuals[participantId].length) * 100,
      ),
    };
  });

  Object.keys(answers.questions).forEach(questionId => {
    let trueAnsw = 0;
    answers.questions[questionId].forEach(user => {
      if (user.answer) trueAnsw++;
    });
    answers.questions[questionId] = {
      all: test.participants.length,
      true: trueAnsw,
      false: test.participants.length - trueAnsw,
      percent: Math.round((trueAnsw / test.participants.length) * 100),
    };
  });
  let all = 0;
  let trueAnsw = 0;
  Object.keys(answers.questions).forEach(questionId => {
    all += answers.questions[questionId].all;
    trueAnsw += answers.questions[questionId].true;
  });

  return {
    common: {
      allQuestions: all,
      trueAnsw,
      percent: Math.round((trueAnsw / all) * 100),
    },
    individual: answers.individuals,
    questions: answers.questions,
  };
};

module.exports.setDomain = domain => {
  config.telegram.BOT_URL = domain;
  return true;
};

module.exports.getDomain = () => {
  return config.telegram.BOT_URL;
};
