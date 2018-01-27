// YOUR CODE HERE:
var url = new URL(window.location);

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


app.handleUsernameClick = function () {
  $(this).toggleClass('friend');

};

app.handleSubmit = function () {
  //debugger
  var text = $('#message').val();
  var room = $('#roomSelect').val();
  var username = url.searchParams.get('username');
  
  var message = {
    username: username,
    text: text,
    roomname: room
  };
  
  app.send(message);
  event.preventDefault();
  return false;
  
};

app.init = function() {
  $('.username').on('click', function() {
    app.handleUsernameClick();
  });
  //debugger
  
  $('.submit').on('submit', function(event) {
    debugger
    event.preventDefault();
    app.handleSubmit();
    console.log('submit clicked');
    return false;
    
  });
};

app.init();













