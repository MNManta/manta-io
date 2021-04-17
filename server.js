// Setup server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

var players = [];

function Player(id, x, y, userid, velocity, color, radius){
  this.id = id;
  this.x = x;
  this.y = y;
  this.userid = userid;
  this.velocity = velocity;
  this.color = color;
  this.radius = radius;
}


server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

setInterval(heartbeat, 1);

function heartbeat(){
  //console.log(players);
  io.emit('heartbeat', players);
}

io.on('connection',
  function(socket) {

    socket.on('start',
      function(data) {
        var player = new Player(socket.id, data.x, data.y, data.id, data.velocity, data.color, data.radius);
        //console.log(player);
        players.push(player);
      }
    );

    socket.on('update',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y);
        var player;
        for (var i = 0; i < players.length; i++){
          if(socket.id == players[i].id){
            player = players[i];
          }
        }
        try {
          player.x = data.x;
          player.y = data.y;
          player.velocity = data.velocity;
          player.radius = data.radius;
        }
        catch (err){
          console.log("Player with ID " + socket.id + " has disconnected.");
        }
      }
    );

    socket.on('disconnect', function(){
        for (var i = 0; i < players.length; i++){
          //console.log(socket.id, players[i].id);
          if(socket.id == players[i].id){
            if (i === 0){
              //This drove me crazy, basically without this the first
              //element never disappears.
              players.splice(0, 1);
            }
            else{
              players.splice(i, i);
            }
          }
        }
        //console.log('Client with ID ' + socket.id + ' disconnected');
        //console.log("These are the players " + players);
      }
    );

  }
);
