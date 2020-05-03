/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const services = require('../../services');
const Lecturer = require('../../ws/lecturers');

// eslint-disable-next-line consistent-return
async function handleQuestion(actualRepeat, id) {
  // get test info from redis
  const testInfo = await services.quickTest.getFromRedis(id);
  // if end test
  if (actualRepeat === testInfo.attempts) {
    console.log('end test !!!!');
    const results = await services.quickTest.getResult(id);
    const statistics = services.quickTest.calculateStatistics(
      results,
      testInfo,
    );
    console.log(statistics);
    const lecturerSocketID = testInfo.test.lecturer_id + testInfo.test.code;
    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'end_test',
        testId: id,
        statistics,
      }),
    );
    await services.bot.sendEndQuestion({
      participants: testInfo.participants,
      statistics: statistics.individual,
    });
    await services.quickTest.deleteFromRedis(id);
    return false;
  }
  // delay from last question or from start event
  await (() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  })();

  if (actualRepeat < testInfo.attempts) {
    const msg = {
      allQuestions: testInfo.attempts,
      actualQuestion: actualRepeat + 1,
      participants_id: testInfo.participants,
      question: {
        id: testInfo.questions[actualRepeat].id,
        title: testInfo.questions[actualRepeat].title,
        subtitle: testInfo.questions[actualRepeat].subtitle,
        testId: testInfo.test.id,
        answers: testInfo.questions[actualRepeat].answers.map(element => {
          return {
            id: element.id,
            title: element.title,
          };
        }),
      },
    };
    // send partcicipant question
    await services.bot.sendQuestion(msg);
    const lecturerSocketID = testInfo.test.lecturer_id + testInfo.test.code;

    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'question',
        question: testInfo.questions[actualRepeat],
      }),
    );
    setTimeout(async () => {
      // get actual data from redis
      const actualTestInfo = await services.quickTest.getFromRedis(id);
      // get patricipants without response on question
      if (actualTestInfo && actualTestInfo.actual === actualRepeat) {
        // somb didn't answer
        // looking participants without answer
        const badParticipants = await services.quickTest.lookingPartWithOutAnswer(
          id,
          actualTestInfo.questions[actualRepeat].id,
          actualTestInfo.participants,
        );
        services.bot.partWithoutAnswer({
          testId: id,
          testTitle: actualTestInfo.title,
          participants: badParticipants,
          questionId: actualTestInfo.questions[actualRepeat].id,
          questionTitle: actualTestInfo.questions[actualRepeat].title,
        });
        // set in results without answer
        const arr = [];
        badParticipants.forEach(participantId => {
          arr.push(
            services.quickTest.setResult({
              testId: id,
              participantId,
              questionId: actualTestInfo.questions[actualRepeat].id,
              answer: false,
            }),
          );
        });

        await Promise.all(arr);

        actualTestInfo.actual++;
        actualTestInfo.count = 0;
        await services.quickTest.saveInRedis(id, actualTestInfo);
        handleQuestion(actualTestInfo.actual, id);
      }
    }, 20000); // timeout
  }
}

// eslint-disable-next-line consistent-return
module.exports.setResult = async body => {
  try {
    // get test info
    const testInfo = await services.quickTest.getFromRedis(body.test_id);
    if (!testInfo) {
      return false; // if testInfo is not exsis => test is not active
    }
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
    const lecturerSocketID = testInfo.test.lecturer_id + testInfo.test.code;
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
    if (testInfo.count + 1 === testInfo.participants.length) {
      // end question round
      testInfo.actual++;
      testInfo.count = 0;
      let results = await services.quickTest.getResult(
        body.test_id,
        body.question_id,
      );
      results = results.map(res => {
        const answArr = [];
        testInfo.questions[testInfo.actual - 1].answers.forEach(
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
        title: testInfo.questions[testInfo.actual - 1].title,
        results,
      });
      handleQuestion(testInfo.actual, test.id);
    } else testInfo.count++;
    await services.quickTest.saveInRedis(test.id, testInfo);
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
    const testInfo = {
      count: 0, // must be 0
      attempts: test.count,
      actual: 0,
      test,
      questions,
      participants,
    };
    await services.quickTest.saveInRedis(test.id, testInfo);
    // recursion function
    handleQuestion(testInfo.actual, test.id);
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
      message: 'this user has already added',
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
