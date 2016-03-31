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

  socket.on('message', function (data) {
    console.log(data);
    socket.send(data);
  });

});

console.log('WS is listening: http://localhost:' + port);