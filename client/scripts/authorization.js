define(["jquery", "utils", "ws", "game"],
function ($, utils, ws, game) {

    var id;
    var sid;
    var wsUri;

    function registerCallback(data) {

        var serverAnswer = $("#server-answer");

        if (data == null)
        {
            serverAnswer.text("Data is null, request might be failed.").css("color", "red");

        } else if (data.result === "ok") {
            serverAnswer.text("Registration is successful.").css("color", "green");

        } else if (data.result === "loginExists") {
            serverAnswer.text("This login already exists.");

        } else if (data.result === "badLogin") {
            serverAnswer.text("Login: minimal length is 2 symbols and "
                + "maximum length is 36 symbols. Allowed charset is "
                + "latin symbols and numbers.").css("color", "red");

        } else if (data.result === "badPassword") {
            serverAnswer.text("Password: minimal length is 6 symbols and "
                + "maximum length is 36 symbols.").css("color", "red");
        }
    }

    function loginCallback(data) {
        if (data.result === "ok") {
            //$("#server-answer").text("Authentication is successful.").css("color", "green");
            $("#logout").css("visibility", "visible");
            $("#content").hide();
            sid = data.sid;
            wsUri = data.webSocket;
            ws.startGame(sid, wsUri);
            $.when(ws.timeout(4000, function() {})).done(function() {game.start();});

        } else if (data.result === "invalidCredentials") {
            $("#server-answer").text("Invalid login or password.").css("color", "red");
        }
    }

    function logoutCallback(data) {
        if (data.result === "ok") {
            $("#server-answer").text("Lets to register or sign in.").css("color", "green");
            $("#logout").css("visibility", "hidden");

        } else if (data.result === "badSid") {
            $("#server-answer").text("Invalid session ID.").css("color", "red");
        }
    }

    function jsonHandle(action, callback) {
        if (action == "logout") {
            var js = {
                "action": "logout",
                "sid": sid
            };

        } else {
            var js = {
                "action": action,
                "login": $("#username").val(),
                "password": $("#password").val()
            };
        }

        utils.postRequest(js, function (response) {
            $("#username, #password").val("");
            $("#server-answer").empty();
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