// Setup server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

var players = [];


function Player(id, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
}


server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
  console.log('Client connected with ID ' + socket.id);
  socket.on('disconnect', function(){
      for (var i = 0; i < players.length; i++){
        if(socket.id == players[i].id){
          players.splice(i, i);
        }
      }
      console.log('Client with ID ' + socket.id + 'disconnected');
    }
  );
});


setInterval(heartbeat, 10);

function heartbeat(){
  io.emit('heartbeat', players);
}

io.on('connection',

  function(socket) {

    socket.on('start',
      function(data) {
        console.log(socket.id + " " + data.x + " " + data.y);
        var player = new Player(socket.id, data.x, data.y);
        players.push(player);
      }
    );

    socket.on('update',
      function(data) {
        console.log(socket.id + " " + data.x + " " + data.y);

        var player;
        for (var i = 0; i < players.length; i++){
          if(socket.id == players[i].id){
            player = players[i];
          }
        }

        player.x = data.x;
        player.y = data.y;

      }
    );

  }
);
