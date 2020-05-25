/* eslint-disable no-param-reassign */

const createError = require('http-errors');
const services = require('../../services');
const Test = require('./test');

module.exports.createTest = async (req, res, next) => {
  try {
    const code = await Test.create({
      lecturerId: req.user.id,
      questionsId: req.body.questionsId,
      title: req.body.title,
    });
    res.json({code});
  } catch (error) {
    next(createError(500, error.message));
  }
};

// eslint-disable-next-line consistent-return
module.exports.addStudent = async (req, res, next) => {
  try {
    const message = await Test.addStudent(req.body);
    res.json(message);
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports.newLecturerConnection = async (socket, headers, wss) => {
  try {
    // get lecturer id by token
    const lecturer = await services.lecturer.checkLecturerToken(headers.token); // lecturer.id
    // create socketId
    const socketId = lecturer.id + headers.code;
    // delete old clients with this id
    wss.clients.forEach(client => {
      if (client.id && client.id === socketId) {
        client.terminate(); // close connection
      }
    });
    // check if socketId is exsist
    await services.quickTest.checkSocketId(socketId, headers.code);
    // assign socketid to socket
    socket.id = socketId;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.launchTest = code => {
  try {
    Test.launchTest(code);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports.setResult = async (req, res, next) => {
  try {
    await Test.setResult(req.body);
    res.json({message: 'successful saved'});
  } catch (error) {
    next(createError(500, error.message));
  }
};
