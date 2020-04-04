const createError = require('http-errors');
const services = require('../../services');
const Lecturer = require('../../ws/lecturers');
const Bot = require('../../ws/bot');

module.exports.createTest = async (req, res, next) => {
  try {
    const code = await services.quickTest.create({
      lecturerId: req.user.id,
      questionsId: req.body.questionsId,
      title: req.body.title,
    });
    res.json({code});
  } catch (error) {
    console.log(error.message);
    next(createError(500, error.message));
  }
};

// eslint-disable-next-line consistent-return
module.exports.addStudent = async (socket, stdData) => {
  try {
    // check code
    const test = await services.quickTest.checkTestCode(stdData.code);
    if (!test) {
      socket.send(
        JSON.stringify({
          path: 'res_add_student',
          participant_id: stdData.participant_id,
          messeage: 'this test is not exsist',
        }),
      );
      return false;
    }
    // find or write data this student
    await services.quickTest.checkStudent(stdData);
    // add student in a wainting room
    await services.quickTest.addStudentInTest(stdData.participant_id, test.id);
    // emit student 'res_add_student'
    socket.send(
      JSON.stringify({
        path: 'res_add_student',
        participant_id: stdData.participant_id,
        testTitle: test.title,
        count: test.count,
      }),
    );
    const send = {
      path: 'newStudent',
      firstName: stdData.first_name,
      lastName: stdData.last_name,
    };
    // send message to lecturer
    const lecturerSocketId = await services.quickTest.getLecturerId(test.id);
    Lecturer.sendLecturerMesseage(lecturerSocketId, JSON.stringify(send));
  } catch (error) {
    socket.send(
      JSON.stringify({
        path: 'error',
        messeage: String(error),
      }),
    );
  }
};

module.exports.newLecturerConnection = async (socket, headers) => {
  try {
    // get lecturer id by token
    const lecturer = await services.lecturer.checkToken(headers.token); // lecturer.id
    // create socketId
    const socketId = lecturer.id + headers.code;
    // check if socketId is exsist
    // socketId == socket_lecturer_id
    await services.quickTest.checkSocketId(socketId, headers.code);
    // assign socketid to socket
    // eslint-disable-next-line no-param-reassign
    socket.id = socketId;
  } catch (error) {
    console.log(error);
  }
};

module.exports.launchTest = async code => {
  try {
    // get test id by code
    const test = await services.quickTest.checkTestCode(code);
    // gett all participant from test
    const participants = await services.quickTest.getParticipants(test.id);
    // un active test
    await services.quickTest.closeTest(test.id);
    // send message them
    const msg = {
      path: 'launch_test',
      participants_id: participants,
    };
    Bot.sendBotMesseage(msg);
  } catch (error) {
    console.error(error);
  }
};
