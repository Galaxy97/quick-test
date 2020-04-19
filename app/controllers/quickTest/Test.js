/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const services = require('../../services');
const Lecturer = require('../../ws/lecturers');

// bad code
const turn = {}; // it will be redis ala cache or buffer for all users
// end bad code

async function handleQuestion(actualRepeat, id) {
  if (actualRepeat === turn[id].attempts) {
    // end test
    console.log('end test !!!!');
    const lecturerSocketID = turn[id].test.lecturer_id + turn[id].test.code;
    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'end_test',
        testId: id,
        participantsId: [],
        statistics: 'it will be statistics all results',
      }),
    );
  }

  await (() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  })();

  if (actualRepeat < turn[id].attempts) {
    turn[id].questions[actualRepeat].testId = turn[id].test.id;
    const msg = {
      participants_id: turn[id].participants,
      question: turn[id].questions[actualRepeat],
    };
    // send partcicipant question
    await services.bot.sendQuestion(msg);
    const lecturerSocketID = turn[id].test.lecturer_id + turn[id].test.code;

    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'question',
        question: turn[id].questions[actualRepeat],
      }),
    );
    setTimeout(async () => {
      // get patricipants without response on question
      if (turn[id].actual === actualRepeat) {
        // somb didn't answer
        // looking participants without answer
        const badParticipants = await services.quickTest.lookingPartWithOutAnswer(
          id,
          turn[id].questions[actualRepeat].id,
          turn[id].participants,
        );
        services.bot.partWithoutAnswer({
          testId: id,
          participants_id: badParticipants,
          questionId: turn[id].questions[actualRepeat].id,
        });
        turn[id].actual++;
        turn[id].count = 0;
        handleQuestion(turn[id].actual, id);
      }
    }, 20000); // timeout
  }
}

module.exports.setResult = async body => {
  try {
    // write in database
    const record = await services.quickTest.setResult({
      testId: body.test_id,
      participantId: body.participant_id,
      questionId: body.question_id,
      answer: body.answer,
    });
    if (!record) {
      return false; // do not save
    }
    const lecturerSocketID =
      turn[body.test_id].test.lecturer_id + turn[body.test_id].test.code;
    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'particapant_answer',
        testId: body.test_id,
        participantId: body.participant_id,
        questionId: body.question_id,
        answer: body.answer,
      }),
    );

    const test = await services.quickTest.getTestById(body.test_id);
    if (turn[test.id].count + 1 === turn[test.id].participants.length) {
      // end question round
      turn[test.id].actual++;
      turn[test.id].count = 0;
      handleQuestion(turn[test.id].actual, test.id);
    } else turn[test.id].count++;
  } catch (error) {
    console.error(error);
  }
  return true;
};

async function prepareTest(test, participants) {
  try {
    const questionsId = await services.quickTest.getQuestionsId(test.id);
    const questionsFunc = [];

    questionsId.forEach(quest => {
      questionsFunc.push(
        services.documents.questions.getById(quest.question_id),
      );
    });

    const questions = await Promise.all(questionsFunc);
    // recursion function
    turn[test.id] = {
      count: 0, // must be 0
      attempts: test.count,
      actual: 0,
      test,
      questions,
      participants,
    };
    setTimeout(() => {
      handleQuestion(turn[test.id].actual, test.id);
    }, 5000);
  } catch (error) {
    console.log(error);
  }
}

module.exports.create = async ({lecturerId, questionsId, title}) => {
  // create code
  const code = await services.quickTest.create({
    lecturerId,
    questionsId,
    title,
  });
  return code;
};

module.exports.addStudent = async body => {
  // check code
  const test = await services.quickTest.checkTestCode(body.code);
  if (!test) {
    throw new Error('this test is not exsist');
    // next(createError(400, 'this test is not exsist'));
  }
  // find or write data this student
  await services.quickTest.checkStudent(body);
  // add student in a wainting room
  const isExsis = await services.quickTest.addStudentInTest(
    body.participant_id,
    test.id,
  );
  if (isExsis) {
    return {
      message: 'this user have added already',
      participant_id: body.participant_id,
      testTitle: test.title,
      count: test.count,
    };
  }
  const send = {
    path: 'newStudent',
    firstName: body.first_name,
    lastName: body.last_name,
  };
  // send message to lecturer
  const lecturerSocketId = await services.quickTest.getLecturerId(test.id);
  Lecturer.sendLecturerMesseage(lecturerSocketId, JSON.stringify(send));
  return {
    participant_id: body.participant_id,
    testTitle: test.title,
    count: test.count,
  };
};

module.exports.launchTest = async code => {
  // get test id by code
  const test = await services.quickTest.getTestByCode(code);
  // gett all participant from test
  const participants = await services.quickTest.getParticipants(test.id);
  // un active test
  await services.quickTest.closeTest(test.id);
  // send message them
  const msg = {
    participants_id: participants,
  };
  await services.bot.launchTest(msg);
  prepareTest(test, participants);
};
