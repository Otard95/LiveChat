/*
 *  ###### Documet requires ######
 */
var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/*
 *  ###### Basis http server ######
 */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client');
})
app.use(express.static('client'));

/*
 *  ###### Socket.io Section ######
 */

var SOCKET_LIST = {}; // List Of connected socets
var CLIENT_LIST = {}; // List of

var Client = function(id) {
  var self = {
    id: id,
    name: 'Guest'
  }
  self.setName = function(newName) {
    if(newName.length < 4) return false;
    for (var c in CLIENT_LIST) {
      if(c.name == newName) return false;
    }
    self.name = newName;
    return true;
  }
  return self;
}

io.on('connection', function(socket) {
  // ### Creating new client
  console.log('New Client Connection');

  socket.id = Math.round(100000000 * Math.random());
  while(!isUnique(socket.id, SOCKET_LIST)) { // Find unique id
    socket.id = Math.round(100000000 * Math.random());
  }
  SOCKET_LIST[socket.id] = socket;
  CLIENT_LIST[socket.id] = Client(socket.id);
  console.log('Client Setup with id: ' + socket.id);

  // ### Requests

  socket.on('updateName', function(data) {
    console.log('Name Update: (' + socket.id + ')' +
        CLIENT_LIST[socket.id].name + " to " + data.newName + ' ==>');

    socket.emit('updateName', {response: CLIENT_LIST[socket.id].setName( data.newName )});

    console.log('     ------  (' + socket.id + ')' + CLIENT_LIST[socket.id].name);
  });

  socket.on('msg', function(data) {
    if(data.msg.length > 0) {
      console.log('(' + socket.id + ')' + CLIENT_LIST[socket.id].name + ': ' + data.msg);
      socket.broadcast.emit('msg', {from: CLIENT_LIST[socket.id].name, msg: data.msg});
    }
  });

  // ### Disconect handler

  socket.on('disconnect', function() {
    console.log("Client with id '" + socket.id + "' disconnected");
    delete SOCKET_LIST[socket.id];
    delete CLIENT_LIST[socket.id];
  });
});

server.listen(3000);

function isUnique(key, list) {
  for (var i in list) {
    if(key == i) return false;
  }
  return true;
}
