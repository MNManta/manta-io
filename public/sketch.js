var socket;
var player;

var players = [];
var racetrack;

function setup() {
  //Full screen canvas
  createCanvas(windowWidth, windowHeight);

  //Create socket connection
  socket = io({transports: ['websocket'], upgrade: false});

  //Create track
  racetrack = new Track();

  //Create player
  player = new Player(0, 0);

  var data = {
    x: player.position.x,
    y: player.position.y,
    id: player.id,
    movement: player.movement,
    velocity: [player.velocity.x, player.velocity.y]
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
      fill(400, 100, 200);
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

  for (i = 0; i < racetrack.pointArray.length; i++) {
    isHit = collideLineCircle(racetrack.pointArray[i][0], racetrack.pointArray[i][1], racetrack.pointArray[i][2], racetrack.pointArray[i][3], player.position.x, player.position.y, 15);
    if (isHit === true){
      console.log("You got hit");
      player.movement = [0, 0];
      player.velocity = createVector(0, 0);
      player.position = createVector(0, 0);
    }
  }
  for (i = 0; i < players.length; i++) {
      //console.log(player.id, players[i].userid);
      console.log(players);
      if (player.id != players[i].userid){
      hitPlayer = collideCircleCircle(player.position.x, player.position.y, 5, players[i].x, players[i].y, 5);
        if (hitPlayer === true){
          console.log(players);
          //player gets enemy movement and velocity
          player.movement = [players[i].movement[0], players[i].movement[1]];
          player.velocity.x = players[i].velocity[0];
          player.velocity.y = players[i].velocity[1];

          //enemy gets player movement and velocity
          players[i].movement = [player.movement[0], player.movement[1]];
          players[i].velocity = [player.velocity.x, player.velocity.y];
        }
      }
  }

  //console.log(player.movement);

  racetrack.show();
  player.show();
  player.update();

  var data = {
    x: player.position.x,
    y: player.position.y,
    movement: player.movement,
    velocity: [player.velocity.x, player.velocity.y]
  };

  //Update position on server
  socket.emit('update', data);
}
