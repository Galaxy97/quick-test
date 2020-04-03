/* eslint-disable no-useless-constructor */
const WebSocket = require('ws');
// const services = require('../../services');
// const controller = require('../../controllers');
// const validator = require('../../utils/socketValidator');
// const schems = require('./validators');

class WsLecturers {
  constructor() {
    this.wss = new WebSocket.Server({port: 3002});
  }

  handle() {
    this.wss.on('connection', (socket, request) => {
      console.log('new lecturer', request);
      this.lecturerID = socket;
      socket.on('message', raw => {
        console.log(raw);
      });
    });
    this.wss.on('close', () => {
      this.lecturerID = null;
      console.log('the bot disconnected');
    });
  }

  launch() {
    if (!this.lecturerID) console.log('errr');
    this.lecturerID.send('launch');
  }
}

const lecturers = new WsLecturers();
module.exports = lecturers;
