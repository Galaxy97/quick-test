const WebSocket = require('ws');
const url = require('url');
const querystring = require('querystring');

const quickTest = require('../../controllers/quickTest');
const validator = require('../../utils/socketValidator');
const schems = require('./validators');

class WsLecturers {
  constructor() {
    this.wss = new WebSocket.Server({noServer: true});
  }

  handle() {
    this.wss.on('connection', (socket, request) => {
      try {
        const queryStr = url.parse(request.url);
        const query = querystring.parse(queryStr.query);
        const validMesseage = validator(schems.newConnection, query);
        if (validMesseage) throw new Error(validMesseage[0].message);

        console.log('new lecturer');
        quickTest.newLecturerConnection(socket, query, this.wss);
        socket.on('message', raw => {
          try {
            const data = JSON.parse(raw);
            if (!data.path) throw new Error('path not found');
            switch (data.path) {
              case 'launch_test':
                // eslint-disable-next-line no-case-declarations
                const validMSG = validator(schems.launchTest, data);
                if (validMSG) throw new Error(validMSG.message);
                quickTest.launchTest(data.code);
                break;
              case 'ping':
                socket.send(
                  JSON.stringify({
                    path: 'pong',
                  }),
                );
                break;
              default:
                throw new Error('path not found');
            }
          } catch (error) {
            socket.send(
              JSON.stringify({
                path: 'error',
                messeage: String(error),
              }),
            );
          }
        });
      } catch (error) {
        socket.send(
          JSON.stringify({
            path: 'error',
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
