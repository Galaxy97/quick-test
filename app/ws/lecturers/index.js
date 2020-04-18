/* eslint-disable no-useless-constructor */
const WebSocket = require('ws');
const url = require('url');
const querystring = require('querystring');

const config = require('../../config');
// const services = require('../../services');
const quickTest = require('../../controllers/quickTest');
const validator = require('../../utils/socketValidator');
const schems = require('./validators');

class WsLecturers {
  constructor() {
    this.wss = new WebSocket.Server({port: config.ws.port});
  }

  handle() {
    this.wss.on('connection', (socket, request) => {
      try {
        const queryStr = url.parse(request.url);
        const query = querystring.parse(queryStr.query);
        const validMesseage = validator(schems.newConnection, query);
        if (validMesseage) throw new Error(validMesseage[0].message);

        console.log('new lecturer', request);
        quickTest.newLecturerConnection(socket, query);
        socket.on('message', raw => {
          console.log(raw);
          try {
            const data = JSON.parse(raw);
            if (!data.path) throw new Error('path not found');
            switch (data.path) {
              case 'launch_test':
                // eslint-disable-next-line no-case-declarations
                const validMSG = validator(schems.launchTest, data);
                if (validMSG) throw new Error(validMSG[0].message);
                quickTest.launchTest(data.code);
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
      } catch (error) {
        socket.send(
          JSON.stringify({
            messeage: String(error),
          }),
        );
        socket.terminate();
      }
    });
  }

  sendLecturerMesseage(id, message) {
    this.wss.clients.forEach(client => {
      if (client.id === id) {
        client.send(message);
      }
    });
  }
}

const lecturers = new WsLecturers();
module.exports = lecturers;
