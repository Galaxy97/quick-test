/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const services = require('../../services');
const Lecturer = require('../../ws/lecturers');
const delay = require('../../utils/delay');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function getResults(test) {
  let results = await services.quickTest.getResult(
    test.id,
    test.questions[test.actual].id,
  );
  results = results.map(res => {
    const {answer} = test.questions[test.actual].answers.find(
      answQuestion => res.participant_answer === answQuestion.id,
    );
    return {
      participants: res.telegram_id,
      answer,
    };
  });
  if (test.funnyMessage) {
    const [motivationPhrases, congtatulationPhrases] = await Promise.all([
      services.quickTest.getMotivationPhrases(),
      services.quickTest.getCongtatulationPhrases(),
    ]);
    results.forEach((val, index) => {
      if (val.answer === true)
        results[index].phrase =
          congtatulationPhrases[
            getRandomInt(congtatulationPhrases.length)
          ].phrase;
      else
        results[index].phrase =
          motivationPhrases[getRandomInt(motivationPhrases.length)].phrase;
    });
  }
  return results;
}

async function timeoutFunc(test) {
  // somb didn't answer
  // looking participants without answer
  const badParticipants = await services.quickTest.lookingPartWithOutAnswer(
    test.id,
    test.questions[test.actual].id,
    test.participants,
  );
  await services.bot.partWithoutAnswer({
    testId: test.id,
    testTitle: test.title,
    participants: badParticipants,
    questionId: test.questions[test.actual].id,
    questionTitle: test.questions[test.actual].title,
  });
  // calculate who has sent answer
  const results = await getResults(test);
  await services.bot.sendResOnQuestion({
    title: test.questions[test.actual].title,
    results,
  });
  //
  // set in results without answer
  const arr = [];
  badParticipants.forEach(participantId => {
    arr.push(
      services.quickTest.setResult({
        testId: test.id,
        participantId,
        questionId: test.questions[test.actual].id,
        answer: 0,
      }),
    );
  });

  await Promise.all(arr);

  test.actual++;
  test.count = 0;
  await services.quickTest.saveInRedis(test.id, test);
  handleQuestion(test.actual, test.id);
}

async function endRound(test) {
  // end question round
  const results = await getResults(test);
  services.bot.sendResOnQuestion({
    title: test.questions[test.actual].title,
    results,
  });
  test.actual++;
  test.count = 0;
  await services.quickTest.saveInRedis(test.id, test);
  handleQuestion(test.actual, test.id);
}

// eslint-disable-next-line consistent-return
module.exports.setResult = async body => {
  try {
    // get test info
    const test = await services.quickTest.getFromRedis(body.test_id);
    if (!test) {
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
      return false; // if don't save
    }
    const lecturerSocketID = test.lecturerId + test.code;
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

    // const test = await services.quickTest.getTestById(body.test_id);
    if (test.count + 1 === test.participants.length) {
      delay(0).then(async () => {
        // close http connection and only then do this function
        await endRound(test);
      });
    } else {
      test.count++;
      await services.quickTest.saveInRedis(test.id, test);
    }
  } catch (error) {
    console.error(error.message);
  }
};

async function prepareQuestion(actualRepeat, test) {
  const msg = {
    participants_id: test.participants,
    question: {
      allQuestions: test.attempts,
      actualQuestion: actualRepeat + 1,
      id: test.questions[actualRepeat].id,
      title: test.questions[actualRepeat].title,
      subtitle: test.questions[actualRepeat].subtitle,
      timeout: 20,
      testId: test.id,
      answers: test.questions[actualRepeat].answers.map(element => {
        return {
          // id and title answer
          id: element.id,
          title: element.title,
        };
      }),
    },
  };
  // send partcicipant question
  await services.bot.sendQuestion(msg);
  const lecturerSocketID = test.lecturerId + test.code;

  Lecturer.sendLecturerMesseage(
    lecturerSocketID,
    JSON.stringify({
      path: 'question',
      question: {
        allQuestions: test.attempts,
        actualQuestion: actualRepeat + 1,
        id: test.questions[actualRepeat].id,
        title: test.questions[actualRepeat].title,
        subtitle: test.questions[actualRepeat].subtitle,
        testId: test.id,
        timeout: 20,
        answers: test.questions[actualRepeat].answers,
      },
    }),
  );
  delay(20000).then(async () => {
    // get actual data from redis
    const actualTestInfo = await services.quickTest.getFromRedis(test.id);
    // get patricipants without response on question
    if (actualTestInfo && actualTestInfo.actual === actualRepeat) {
      timeoutFunc(actualTestInfo);
    }
  });
}

// eslint-disable-next-line consistent-return
async function handleQuestion(actualRepeat, id) {
  // get test info from redis
  const test = await services.quickTest.getFromRedis(id);
  // if end test
  if (actualRepeat === test.attempts) {
    const results = await services.quickTest.getResult(id);
    const statistics = services.quickTest.calculateStatistics(results, test);
    const lecturerSocketID = test.lecturerId + test.code;
    Lecturer.sendLecturerMesseage(
      lecturerSocketID,
      JSON.stringify({
        path: 'end_test',
        testId: id,
        statistics: {
          common: statistics.common,
          individual: statistics.individualArr,
          questions: statistics.questionsArr,
        },
      }),
    );
    await services.bot.sendEndQuestion({
      participants: test.participants,
      statistics: statistics.individualArr,
    });
    await services.quickTest.deleteFromRedis(id);
    await services.quickTest.deleteTest(id);
    return false; // end this function
  }
  // delay from last question or from start event
  await delay(5000);

  if (actualRepeat < test.attempts) {
    prepareQuestion(actualRepeat, test);
  }
}

module.exports.launchTest = async code => {
  // get test id by code
  // check code
  const testDB = await services.quickTest.getTestByCode(code);
  if (!testDB || !testDB.id) {
    throw new Error('this test is not exsist');
  }
  const test = await services.quickTest.getFromRedis(testDB.id);
  // gett all participant from test
  const participants = await services.quickTest.getParticipants(test.id);
  // unactive test
  await services.quickTest.closeTest(test.id);
  test.active = false;
  test.participants = participants;

  await services.quickTest.saveInRedis(test.id, test);
  // send message them
  await services.bot.launchTest({
    participants_id: participants,
  });
  handleQuestion(test.actual, test.id);
};

module.exports.addStudent = async body => {
  // check code
  const testDB = await services.quickTest.getTestByCode(body.code);
  if (!testDB || !testDB.id) {
    throw new Error('this test is not exsist');
  }
  const test = await services.quickTest.getFromRedis(testDB.id);
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
      count: test.attempts,
    };
  }
  // send message to lecturer
  const lecturerSocketId = await services.quickTest.getLecturerId(test.id);
  Lecturer.sendLecturerMesseage(
    lecturerSocketId,
    JSON.stringify({
      path: 'newStudent',
      participantId: body.participant_id,
      firstName: body.first_name,
      lastName: body.last_name,
    }),
  );
  return {
    participant_id: body.participant_id,
    testTitle: test.title,
    count: test.attempts,
  };
};

module.exports.create = async ({
  lecturerId,
  questionsId,
  title,
  funnyMessage,
}) => {
  // create code
  const test = await services.quickTest.create({
    lecturerId,
    questionsId,
    title,
    funnyMessage,
  });

  test.attempts = questionsId.length;
  test.questionsId = questionsId;
  test.title = title;
  test.lecturerId = lecturerId;
  test.active = true;
  test.funnyMessage = funnyMessage || false;
  const questionsFunc = [];

  questionsId.forEach(id => {
    questionsFunc.push(services.documents.questions.getById(id));
  });

  const questions = await Promise.all(questionsFunc);
  test.questions = questions;
  test.count = 0;
  test.actual = 0;

  await services.quickTest.saveInRedis(test.id, test);
  return test.code;
};
