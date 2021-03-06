define([
  'jquery',
  'utils/utils',
  'game/game'

], function ($, utils, game) {
  var sid_;

  function registerCallback(data) {
    var serverAnswer = $('#server-answer');
    if (data === null) {
      serverAnswer.text('Data is null, request might be failed.').css('color', 'red');
    }

    switch (data.result) {
    case 'ok':
      //serverAnswer.text("Registration is successful.").css("color", "green");
      jsonHandle('login', loginCallback);
      break;

    case 'loginExists':
      $('#username, #password').val('');
      serverAnswer.text('This login already exists.').css('color', 'red');
      break;

    case 'badLogin':
      $('#username, #password').val('');
      serverAnswer.text('Login: minimal length is 2 symbols and ' + 'maximum length is 36 symbols. Allowed charset is ' + 'latin symbols and numbers.').css('color', 'red');
      break;

    case 'badPassword':
      $('#username, #password').val('');
      serverAnswer.text('Password: minimal length is 6 symbols and ' + 'maximum length is 36 symbols.').css('color', 'red');
      break;

    case 'badClass':
      $('#username, #password').val('');
      serverAnswer.text('Class: one of the following options: ' + 'warrior, rogue, mage.').css('color', 'red');
      break;

    }
  }

  function loginCallback(data) {
    if (data.result === 'ok') {
      $('#server-answer').text('Authentication is successful.').css('color', 'green');
      sid_ = data.sid;

      $.when(game.initSocket(data.webSocket), utils.timeout(3000, function () {
        $('#content, #test-form').hide();
        $('#logout, #items, #items select').show();

      })).done(function () {
        game.GetConsts(data);
        game.start(data);
      });

    } else if (data.result === 'invalidCredentials') {
      $('#password').val('');
      $('#server-answer').text('Invalid login or password.').css('color', 'red');
    }
  }

  function logoutCallback(data) {
    if (data.result === 'ok') {
      $('#server-answer').text('Lets to register or sign in.').css('color', 'green');
      $('#logout').css('visibility', 'hidden');
      location.href = utils.getServerAddress();

    } else if (data.result === 'badSid') {
      $('#server-answer').text('Invalid session ID.').css('color', 'red');
    }
  }

  function jsonHandle(action, callback) {
    if (action === 'logout') {
      var js = {
        'action': 'logout',
        'sid': sid_
      };

    } else {
      var js = {
        'action': action,
        'login': $('#username').val(),
        'password': $('#password').val(),
        'class': $('#player-classes').find(':selected').text()
      };
    }

    utils.postRequest(js, function (response) {
      $('#server-answer').empty();
      callback(response);
    });

  }
  return {
    registerCallback: registerCallback,
    loginCallback: loginCallback,
    logoutCallback: logoutCallback,
    jsonHandle: jsonHandle
  };
});
