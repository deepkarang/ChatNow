var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var connection  = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'messages'
});
var username;
var prevmessages;
var receivername;

__dirname = path.resolve();
app.use(express.static(__dirname));

app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        username = data;
        var post = {Username: username, Current: 1};
        var current = {Current: 0};
        connection.query('UPDATE users SET ? WHERE Username IS NOT NULL', current);
        var registeruser = connection.query('INSERT INTO users SET ?', post);
        var loadedmsgs = connection.query('SELECT DISTINCT Username FROM users', function(err,rows,fields){
          if (err) throw err;
          if (rows!=null){
              for (var i in rows){
              client.emit('logs',rows[i].Username);
              }
          }
          
        });
    });

    client.on('displaymsg', function(data){
        var post = {Username: data};
        client.emit('username', post);
        var loadedmsgs = connection.query('SELECT Message FROM messagelog WHERE ?', post , function(err,rows,fields){
          if (err) throw err;
          prevmessages = rows;
        });
    });
    
    client.on('receiver', function(data){
       receivername = data;
       var post = {Receivername: data};
       var loadedmsgs = connection.query('SELECT Message FROM messagelog WHERE ?', post) 
    });

    client.on('joinchat', function(){
      for (var i in prevmessages) client.emit('prevmsgs', prevmessages[i].Message);
    });

    client.on('disconnect', function() {
       console.log('Client disconnected...');
    });
    
    client.on('loadmsgs',function(data){
       var post = {Username: data};
       var loadedmsgs = connection.query('SELECT Message FROM messagelog WHERE ?',post, function(err, rows, fields){
           for (var i in loadedmsgs) client.emit('showmsgs', loadedmsgs[i].Message);
       }); 
    });

    client.on('messages', function(data) {
          var datetime = new Date().toString;
          var currindicator = {Current: 1};
          var currUser = connection.query('SELECT * FROM users WHERE ?', currindicator, function(err, rows, fields){
              for (var i in currUser){
                  console.log(rows);
                  var post = {Username: (rows), Message: data, Datetime: datetime};
                  var sentmsgs = connection.query('INSERT INTO messagelog SET ?', post);
                  break;
              }                 
          });
          
          client.emit('broad', data);
    });

});

server.listen(4200);
