// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.HRSF89.hackreactor.com/chatterbox/classes/messages';

app.init = function () {};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function () {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    // data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log(`message received: ${data}`);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error(`failed to get: ${data}`);
    }
  });
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.renderMessage = function (message) {
  var roomName = message.roomname;
  var userName = message.username;
  var text = message.text;

  var messageDiv = $('<div>', {
    class: roomName
  });

  var userNameParagraph = $('<p>', {
    class: 'username',
    text: userName
  });

  var textParagraph = $('<p>', {
    class: 'content',
    text: text
  });
  
  messageDiv.append(userNameParagraph, textParagraph);
  
  $('#chats').prepend(messageDiv);
};

app.renderRoom = function (roomname) {
  var roomName = $('<option>', {
    value: roomname,
    text: roomname
  });
  
  $('#roomSelect').append(roomName);
};














