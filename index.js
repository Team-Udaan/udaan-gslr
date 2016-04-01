var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

var port = process.env.port;

if (!port) {
  console.error('Port is not defined as environmental variable.');
  return 1;
}

var wss = new WebSocketServer({
  port: port
});

wss.on('connection', function (socket) {

  console.log('Connection');

  socket.on('message', function (data) {
    console.log(data);
    data = JSON.parse(data);
    data.data = data.data || {};
    data.data.status = 'success';
    socket.send(JSON.stringify(data));
  });

});

console.log('WS is listening: ws://localhost:' + port);