/* eslint-disable no-useless-constructor */
const WebSocket = require('ws');
// const services = require('../../services');
const quickTest = require('../../controllers/quickTest');
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
              quickTest.addStudent(socket, data);
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
      console.log('the bot disconnected');
    });
  }

  sendBotMesseage(message) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const bot = new WsBot();
module.exports = bot;
