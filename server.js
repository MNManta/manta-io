'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = 'index.html';

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected with ID ' + socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

var players = [];

function Player(id, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
}

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
