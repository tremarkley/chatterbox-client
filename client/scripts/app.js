// YOUR CODE HERE:
var url = new URL(window.location);

var app = {};

app.messages = [];

app.chatRooms = {};

app.initialized = false;

app.usernameEventListenerSet = false;

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.handleSuccessfulSend();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', JSON.stringify(data));
    }
  });
};

app.fetch = function (lastUpdate) {
  if (lastUpdate === undefined) {
    var currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - 30);
    var lastUpdate = currentTime.toISOString();
  }
  if (!app.initialized) {
    var order = '-createdAt';
  } else {
    var order = 'createdAt';
  }
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    data: { order: order, 
      where: { 'createdAt': {'$gte': {'__type': 'Date', 'iso': lastUpdate}}}
    },
    contentType: 'application/json',
    success: function (data) {
      data.results.forEach(function(message) {
        app.renderRoom(message.roomname);
        app.renderMessage(message);
        app.messages.push(message);
      });
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error(`failed to get: ${data}`);
    }
  });
};

app.handleSuccessfulSend = function() {
  $('#message').val('');
  app.retrieveNewMessages();
};

app.retrieveNewMessages = function() {
  var lastUpdate = app.messages[0]['updatedAt'];
  console.log('retrieving new messages from: ' + lastUpdate);
  app.fetch(lastUpdate);
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.renderMessage = function (message) {
  debugger
  var roomName = xssFilters.inHTMLData(message.roomname);
  var userName = xssFilters.inHTMLData(message.username);
  var text = xssFilters.inHTMLData(message.text);

  var messageDiv = $('<div>', {
    class: `chat ${roomName}`
  });

  var userNameParagraph = $('<p>', {
    class: `username username-${userName}`,
    
    text: userName
  });

  var textParagraph = $('<p>', {
    class: 'content',
    text: text
  });
  
  messageDiv.append(userNameParagraph, textParagraph);
  if (!app.initialized) {
    $('#chats').append(messageDiv);
  } else {
    $('#chats').prepend(messageDiv);
  }
  
};

app.renderRoom = function (roomname) {
  if (app.chatRooms[roomname] === undefined) {
    app.chatRooms[roomname] = true;
    var exists = false;
    $('#roomSelect option').each(function() {
      if (this.value === roomname) {
        exists = true;
      }
    });
    if (!exists) {
      var roomName = $('<option>', {
        value: roomname,
        text: roomname
      });
  
      $('#roomSelect').append(roomName);
    }
  }
};


app.handleUsernameClick = function () {
  var userName = $(this).text();
  $(document.getElementsByClassName('username-' + userName)).each((index, value) => $(value).addClass('friend'));
};

app.handleSubmit = function () {
  var text = $('#message').val();
  var room = $('#roomSelect').val();
  var username = url.searchParams.get('username');
  
  var message = {
    username: username,
    text: text,
    roomname: room
  };
  
  app.send(message);

};

app.init = function() {
  app.fetch();
  app.initialized = true;
};

$(window).load(function() {
  app.init();
  
  $(document).on('click', '.username', function(event) {
    console.log('username clicked');
    app.handleUsernameClick.call(this);
  });
  
  $('#send .submit').on('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    app.handleSubmit();
    console.log('submit clicked');
  });
});














