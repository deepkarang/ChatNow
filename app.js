// Establishing dependencies with required modules
// Creating http server, db connection, socket.io ports 
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var path = require('path');
var credentials = require('./config').credentials;
var connection  = mysql.createConnection(credentials);
var username;
var prevmessages;
var receivername;

__dirname = path.resolve();
app.use(express.static(__dirname));

//Basic get request to server to get routed to index.html
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/about', function(req, res, next) {
   res.sendFile(__dirname + '/src/about.html'); 
});

// Connfigure server-side logic to only run once connection is established by the client
io.on('connection', function(client) {
    console.log('Client connected...');
    
    // Initially gather login info (username) and populate friend list accordingly
    // Called when user first opens page
    client.on('join', function(data) {
        var clientName = data;
        if (!clientName) return;
        //Check if user is already registered
        let getUserRegistration = "SELECT * FROM `users` WHERE `username`='"+clientName+"'";
        connection.query(getUserRegistration, function(err,rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (rows!=null){
                if (rows.length < 1){
                    //No preexisting users with the same name
                    let initializeUser = "INSERT INTO `users` (username) VALUES (" + JSON.stringify(clientName) + ")";
                    connection.query(initializeUser, function(err, rows, fields) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                    });
                    return;
                } else {
                    let user = rows[0];
                    client.emit('currentUserInfo', user);
                }
            }
        });
        let getFriends = "SELECT id, username FROM users WHERE username <> '" + clientName + "'";
            connection.query(getFriends, function(err,rows,fields){
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (rows!=null){
                    for (var i in rows){
                        var res = {
                            name: rows[i].username,
                            id: rows[i].id
                        };
                        client.emit('friendslist',res);
                    }
                }
            });
    });

    client.on('getConversation', function(data) {
        let senderName = data.sender;
        let receiverName = data.receiver;
        let getConversationQuery = "SELECT * FROM `messagelog` "+
                                    "WHERE (sender=" + JSON.stringify(senderName) + " AND receiver=" + JSON.stringify(receiverName) +
                                    ") OR (sender=" + JSON.stringify(receiverName) + " AND receiver=" + JSON.stringify(senderName) + ")";
        connection.query(getConversationQuery, function (err,rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }
            let messages = [];
            for (var i=0;i<rows.length;i++) {
                var obj = {
                    sender: rows[i].sender,
                    message: rows[i].message,
                    time: rows[i].created_at.toLocaleString()
                }
                messages.push(obj);
            }
            client.emit('receivedConversation', messages);
        });
    });

    client.on('sendMessage', function(data) {
        let sendMessageQuery = "INSERT INTO `messagelog` (sender, message, receiver) VALUES ("+JSON.stringify(data.sender)+","+JSON.stringify(data.message)+","+JSON.stringify(data.receiver)+")";
        connection.query(sendMessageQuery, function(err,rows,fields) {
            if (err) {
                console.log(err);
                throw err;
            }
            return;
        });
    });

    client.on('disconnect', function() {
        console.log('Client disconnected...');
     });

});

server.listen(4200);
