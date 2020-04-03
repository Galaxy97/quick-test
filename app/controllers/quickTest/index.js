const createError = require('http-errors');
const services = require('../../services');

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
  } catch (error) {
    socket.send(
      JSON.stringify({
        path: 'error',
        messeage: String(error),
      }),
    );
  }
};
