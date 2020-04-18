const dataBase = require('../../db');

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
    [check] = await dataBase('tests')
      .select('code')
      .where({code});
  } while (check);
  // write test data test
  const [testId] = await dataBase('tests')
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
  await dataBase('test_questions').insert(tq);

  if (testId) return code;
  return false;
};

module.exports.checkTestCode = async code => {
  const [test] = await dataBase('tests')
    .select(
      'id',
      'title',
      dataBase.raw('COUNT(test_questions.test_id) :: integer as count'),
    )
    .innerJoin('test_questions', 'test_questions.test_id', 'tests.id')
    .where({code, is_open: true})
    .groupBy('id');
  return test;
};

module.exports.getTestByCode = async code => {
  const [test] = await dataBase('tests')
    .select(
      'id',
      'lecturer_id',
      'code',
      dataBase.raw('COUNT(test_questions.test_id) :: integer as count'),
    )
    .innerJoin('test_questions', 'test_questions.test_id', 'tests.id')
    .where({code, is_open: true})
    .groupBy('id');
  return test;
};
module.exports.getTestById = async id => {
  const [test] = await dataBase('tests')
    .select()
    .where({id});
  return test;
};

module.exports.checkStudent = async student => {
  try {
    const [participant] = await dataBase('participants')
      .select('telegram_id')
      .where({telegram_id: student.participant_id});
    if (!participant) {
      await dataBase('participants').insert({
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
  const rows = await dataBase('test_participants').where({
    test_id: testId,
    telegram_id: telegramId,
  });
  if (rows.length === 0) {
    await dataBase('test_participants').insert({
      test_id: testId,
      telegram_id: telegramId,
    });
  } else return true;
};

module.exports.checkSocketId = async (socketId, code) => {
  const [test] = await dataBase('tests')
    .select('id')
    .where({code});
  const [socket] = await dataBase('test_lecturers')
    .select()
    .where({test_id: test.id});
  if (!socket) {
    await dataBase('test_lecturers').insert({
      test_id: test.id,
      socket_id: socketId,
    });
  } else {
    await dataBase('test_lecturers')
      .update({
        test_id: test.id,
        socket_id: socketId,
      })
      .where({test_id: test.id});
  }
};

module.exports.getLecturerId = async testId => {
  const [test] = await dataBase('test_lecturers')
    .select('socket_id')
    .where({test_id: testId});
  return test.socket_id;
};

// eslint-disable-next-line consistent-return
module.exports.getParticipants = async testId => {
  try {
    const participants = await dataBase('test_participants')
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
    await dataBase('tests')
      .update({is_open: false})
      .where({id: testId});
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
module.exports.getQuestionsId = async testId => {
  try {
    const ids = await dataBase('test_questions')
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
  const [record] = await dataBase('test_results').where({
    test_id: testId,
    telegram_id: participantId,
    question_id: questionId,
  });
  if (!record) {
    await dataBase('test_results').insert({
      test_id: testId,
      telegram_id: participantId,
      question_id: questionId,
      participant_answers: JSON.stringify(answer),
    });
    return true;
  }
  return false;
};

module.exports.lookingPartWithOutAnswer = async (
  testId,
  questionId,
  participants,
) => {
  console.log(testId, questionId, participants);
  let partWithAnswer = await dataBase('test_results')
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
