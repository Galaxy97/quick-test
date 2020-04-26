/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const services = require('../../services');
const Lecturer = require('../../ws/lecturers');

// bad code
const turn = {}; // it will be redis ala cache or buffer for all users
// end bad code

async function handleQuestion(actualRepeat, id) {
  // if end test
  if (actualRepeat === turn[id].attempts) {
    console.log('end test !!!!');
    const results = await services.quickTest.getResult(id);
    const lecturerSocketID = turn[id].test.lecturer_id + turn[id].test.code;
    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'end_test',
        testId: id,
        statistics: results,
      }),
    );
    await services.bot.sendEndQuestion({
      participants: turn[id].participants,
    });
  }
  // delay from last question or from start event
  await (() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  })();

  if (actualRepeat < turn[id].attempts) {
    const msg = {
      participants_id: turn[id].participants,
      question: {
        id: turn[id].questions[actualRepeat].id,
        title: turn[id].questions[actualRepeat].title,
        subtitle: turn[id].questions[actualRepeat].subtitle,
        testId: turn[id].test.id,
        answers: turn[id].questions[actualRepeat].answers.map(element => {
          return {
            id: element.id,
            title: element.title,
          };
        }),
      },
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
          participants: badParticipants,
          questionId: turn[id].questions[actualRepeat].id,
        });
        turn[id].actual++;
        turn[id].count = 0;
        handleQuestion(turn[id].actual, id);
      }
    }, 20000); // timeout
  }
}

// eslint-disable-next-line consistent-return
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
      let results = await services.quickTest.getResult(
        body.test_id,
        body.question_id,
      );
      results = results.map(res => {
        const answArr = [];
        turn[test.id].questions[turn[test.id].actual - 1].answers.forEach(
          answQuestion => {
            res.participant_answers.forEach(answ => {
              if (answ === answQuestion.id) {
                answArr.push(answQuestion.answer);
              }
            });
          },
        );
        return {
          participants: res.telegram_id,
          answers: answArr,
        };
      });
      await services.bot.sendResOnQuestion({
        title: turn[test.id].questions[turn[test.id].actual - 1].title,
        results,
      });
      handleQuestion(turn[test.id].actual, test.id);
    } else turn[test.id].count++;
  } catch (error) {
    console.error(error);
  }
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
    turn[test.id] = {
      count: 0, // must be 0
      attempts: test.count,
      actual: 0,
      test,
      questions,
      participants,
    };
    // recursion function
    handleQuestion(turn[test.id].actual, test.id);
  } catch (error) {
    console.log(error.message);
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
