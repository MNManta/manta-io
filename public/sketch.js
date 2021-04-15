var socket;
var player;

var players = [];
var racetrack;

function setup() {
  //Full screen canvas
  createCanvas(windowWidth, windowHeight);

  //Create socket connection
  socket = io();

  //console.log(socket);

  //Create track
  racetrack = new Track();

  //Create player
  player = new Player(0, 0, racetrack, socket);

  var data = {
    x: player.position.x,
    y: player.position.y
  };

  //Send player position data to the server
  socket.emit('start', data);

  socket.on('heartbeat',
    function(data){
      players = data;
    }
  );
}

function windowResized() {
  //Resizes screen dynamically
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //Set white background
  background(256)

  //Center the game
  translate(width / 2, height / 2);

  //Follow the player
  translate(-2*player.position.x, -2*player.position.y);

  //Zoom in by 2x
  scale(2);

  for (var i = 0; i < players.length; i++){
    if (players[i].id != socket.id){
      fill(100, 100, 200);
      strokeWeight(0);
      ellipse(players[i].x, players[i].y, 5, 5);
    }
  }


  //Arrow Key Movement
  if (keyIsDown(LEFT_ARROW)) {
    player.movement[0] -= 0.1;
  };

  if (keyIsDown(RIGHT_ARROW)) {
    player.movement[0] += 0.1;
  };

  if (keyIsDown(UP_ARROW)) {
    player.movement[1] -= 0.1;
  };

  if (keyIsDown(DOWN_ARROW)) {
    player.movement[1] += 0.1;
  };

  //console.log(player.movement);

  racetrack.show();
  player.show();
  player.update();

  var data = {
    x: player.position.x,
    y: player.position.y
  };

  //Update position on server
  socket.emit('update', data);
}
