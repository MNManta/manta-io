var socket;
var player;

var radius = 15;

var players = [];
var racetrack;

function setup() {
  //Full screen canvas
  createCanvas(windowWidth, windowHeight);

  //Create socket connection
  socket = io({transports: ['websocket'], upgrade: false});

  //Create track
  racetrack = new Track();

  colorsArray = ['#988B8E', '#140D4F', '#E5C3D1', '#6FEDB7', '#3F26D9', '#E07A5F', '#F2CC8F',
  '#6B0504', '#FF84E8', '#414361', '#9EBD6E', "#805D93", "#385F71", "#CF4D6F"];

  playercolor = _.sample(colorsArray);

  for (i = 0; i < players.length; i++) {
    //This could break with too many players
    while (players[i].color == playercolor){
      playercolor = _.sample(colorsArray);
    }
  }

  //Create player (20*random() + -20*random())
  player = new Player((30*random() + -30*random()), (30*random() + -30*random()), playercolor, radius);

  var data = {
    x: player.position[0],
    y: player.position[1],
    id: player.id,
    velocity: player.velocity,
    color: player.color,
    radius: player.radius
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
  translate(-player.position[0], -player.position[1]);

  for (var i = 0; i < players.length; i++){
    if (players[i].id != socket.id){
      fill(players[i].color);
      strokeWeight(0);
      ellipse(players[i].x, players[i].y, radius, radius);
    }
  }

  for (i = 0; i < racetrack.pointArray.length; i += 4) {
    isHit = collideLineCircle(racetrack.pointArray[i], racetrack.pointArray[i+1], racetrack.pointArray[i+2], racetrack.pointArray[i+3], player.position[0], player.position[1], 10 + radius);
    if (isHit === true){
      console.log("You got hit");
      player.velocity = [0, 0];
      player.position = [(30*random() + -30*random()), (30*random() + -30*random())];
    }
  }
  for (i = 0; i < players.length; i++) {
      //console.log(player.id, players[i].userid);
      //console.log(players);
      if (player.id != players[i].userid){
      hitPlayer = collideCircleCircle(player.position[0], player.position[1], (player.forcefield*radius), players[i].x, players[i].y, players[i].radius);
        if(hitPlayer === true){
          if ((player.forcefield*radius) > players[i].radius){
            //console.log(players);
            //player gets enemy velocity and velocity
            player.velocity = [0.01*player.velocity[0], 0.01*player.velocity[1]];

            //enemy gets player velocity and velocity
            players[i].velocity = [player.velocity[0], player.velocity[1]];

            if(player.position[0] - players[i].x <= 0){
              players[i].velocity[0] += 0.5;
            }
            else{
              players[i].velocity[0] -= 0.5;
            }

            if(player.position[1] - players[i].y <= 0){
              players[i].velocity[1] += 0.5;
            }
            else{
              players[i].velocity[1] -= 0.5;
            }
          }
          else if ((player.forcefield*radius) < players[i].radius){
            //console.log(players);
            //player gets enemy velocity and velocity
            if (players[i].velocity[0] == 0){
              player.velocity = [players[i].velocity[0] - player.velocity[0], players[i].velocity[1] - player.velocity[1]];
            }
            else{
              player.velocity = [players[i].velocity[0], players[i].velocity[1]];
            }
            //enemy gets player velocity and velocity
            //players[i].velocity = [player.velocity[0], player.velocity[1]];

            if(player.position[0] - players[i].x <= 0){
              player.velocity[0] -= 0.5;
            }
            else{
              player.velocity[0] += 0.5;
            }

            if(player.position[1] - players[i].y <= 0){
              player.velocity[1] -= 0.5;
            }
            else{
              player.velocity[1] += 0.5;
            }
          }
          else {
            //console.log(players);
            //player gets enemy velocity and velocity
            player.velocity = [players[i].velocity[0], players[i].velocity[1]];

            //enemy gets player velocity and velocity
            players[i].velocity = [player.velocity[0], player.velocity[1]];

            if(player.position[0] - players[i].x <= 0){
              player.velocity[0] -= 0.1;
              players[i].velocity[0] += 0.1;
            }
            else{
              player.velocity[0] += 0.1;
              players[i].velocity[0] -= 0.1;
            }

            if(player.position[1] - players[i].y <= 0){
              player.velocity[1] -= 0.1;
              players[i].velocity[1] += 0.1;
            }
            else{
              player.velocity[1] += 0.1;
              players[i].velocity[1] -= 0.1;
            }
          }
        }
      }
  }

  //console.log(player.velocity);

  racetrack.show();
  player.show();
  player.update();

  //Arrow Key velocity
  if (keyIsDown(LEFT_ARROW)) {
    player.velocity[0] -= 0.1;
  };

  if (keyIsDown(RIGHT_ARROW)) {
    player.velocity[0] += 0.1;
  };

  if (keyIsDown(UP_ARROW)) {
    player.velocity[1] -= 0.1;
  };

  if (keyIsDown(DOWN_ARROW)) {
    player.velocity[1] += 0.1;
  };

  var data = {
    x: player.position[0],
    y: player.position[1],
    velocity: player.velocity,
    radius: (radius*player.forcefield)
  };

  //Update position on server
  socket.emit('update', data);
}
