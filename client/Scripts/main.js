var socket = io();

socket.on('msg', function(data) {
  console.log('Msg get:' + data.from + ', ' + data.msg);
  chat.rec(data.from, data.msg);
});

socket.on('updateName', function(data) {
  if(data.response) {
    chat.name = chat.nameTo;
    chat.nameTo = '';
    chat.rec('Server', 'Your nickname has changed.');
  } else {
    chat.nameTo = '';
    chat.rec('Server', 'The nickname might be taken or it was invalid.');
  }
});

var chat = {
  name: 'Guest',
  nameTo: '',
  container: null,
  input: null,
  content: null,
  nameDisplay: null,
  send: function() {
    if(chat.input.value.length > 0) {
      socket.emit('msg', {msg: chat.input.value});
      chat.input.value = '';
    }
  },
  rec: function(from, msg) {
    chat.content.innerHTML += from + ': ' + msg + '</br>';
  },
  updateName: function() {
    chat.nameTo = chat.nameDisplay.value;
    socket.emit('updateName', { newName: chat.nameTo});
  }
};

window.onload = function() {
  chat.container = document.getElementsByClassName('chatView')[0];
  chat.input = document.getElementById('chatInput');
  chat.content = chat.container.getElementsByClassName('content')[0];
  chat.nameDisplay = chat.container.getElementsByClassName('myName')[0];
}
