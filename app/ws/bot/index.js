/* eslint-disable no-useless-constructor */
const WebSocket = require('ws');
// const services = require('../../services');
const controller = require('../../controllers');
const validator = require('../../utils/socketValidator');
const schems = require('./validators');

class WsBot {
  constructor() {
    this.wss = new WebSocket.Server({port: 3001});
  }

  handle() {
    this.wss.on('connection', socket => {
      this.telegram = socket;
      socket.on('message', raw => {
        console.log(raw);
        try {
          const data = JSON.parse(raw);
          if (!data.path) throw new Error('path not found');
          switch (data.path) {
            case 'add_student':
              // eslint-disable-next-line no-case-declarations
              const validMesseage = validator(schems.addStudents, data);
              if (validMesseage) throw new Error(validMesseage[0].message);
              controller.quickTest.addStudent(socket, data);
              break;
            default:
              throw new Error('path not found');
          }
        } catch (error) {
          socket.send(
            JSON.stringify({
              messeage: String(error),
            }),
          );
        }
      });
    });
    this.wss.on('close', () => {
      this.telegram = null;
      console.log('the bot disconnected');
    });
  }

  launch() {
    if (!this.telegram) console.log('errr');
    this.telegram.send('launch');
  }
}

const bot = new WsBot();
module.exports = bot;
