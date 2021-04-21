// Setup server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

var players = {};

var diameter = 12;

var colorsArray = ['#988B8E', '#140D4F', '#E5C3D1', '#6FEDB7', '#3F26D9', '#E07A5F', '#F2CC8F',
'#6B0504', '#FF84E8', '#414361', '#9EBD6E', "#805D93", "#385F71", "#CF4D6F"];

var playercolor;

function Player(x, y, color, diameter, name){
  this.position = [x, y];
  this.velocity = [0,0];
  this.color = color;
  this.diameter = diameter;
  this.name = name;
}

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});


// Routing
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection',
  function(socket) {

    var clientid = socket.id;

    socket.on('start',
      function(name) {
        //When player connects, make a Player object
        //Constructor Player(id, x, y, velocity, color, diameter)
        playercolor = colorsArray[Math.floor(Math.random() * colorsArray.length)];
        var player = new Player(10*diameter*Math.random()*2 - 10*diameter, 10*diameter*Math.random()*2 - 10*diameter,
        playercolor, diameter, name);

        players[clientid] = player;

        socket.emit('getID', clientid);
        socket.emit('heartbeat', players);
        //console.log("Current players in lobby: ");
        //console.log(players);
      }
    );

    socket.on('update',
      function(data) {

        if (typeof players[clientid] !== "undefined"){
          var servertime = new Date().getTime();
          var deltatime = (servertime - data[1])/2;
          //console.log(deltatime);
          players[clientid].velocity = data[0];
          players[clientid].position = [players[clientid].position[0] + (players[clientid].velocity[0]),
           players[clientid].position[1] + (players[clientid].velocity[1])];

          //console.log(players[clientid].position);
        }
        else{
          //console.log('Client with ID ' + clientid + ' disconnected');
        }
        socket.emit('heartbeat', players);
      }
    );

    socket.on('disconnect', function(){
        delete players[clientid];
        socket.emit('heartbeat', players);
        //console.log("The following client disconnected: ");
        //console.log(clientid);
        //console.log("Current players in lobby: ");
        //console.log(players);
        //console.log('Client with ID ' + socket.id + ' disconnected');
        //console.log("These are the players " + players);
      }
    );

    socket.on('hitwall', function(){
      if (typeof players[clientid] !== "undefined"){
        players[clientid].velocity = [0, 0];
        players[clientid].position = [10*diameter*Math.random()*2 - 10*diameter, 10*diameter*Math.random()*2 - 10*diameter];
        socket.emit('heartbeat', players);
        }
      }
    );

    socket.on('hitplayer', function(data){
        if (typeof players[clientid] !== "undefined"){
          players[clientid].velocity = data;
          socket.emit('heartbeat', players);
        }
      }
    );

  }
);
