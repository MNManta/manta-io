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

  colorsArray = ['#988B8E', '#140D4F', '#E5C3D1', '#6FEDB7', '#3F26D9', '#E07A5F', '#F2CC8F',
  '#6B0504', '#FF84E8', '#414361', '#9EBD6E', "#805D93", "#385F71", "#CF4D6F"];

  playercolor = _.sample(colorsArray);

  for (i = 0; i < players.length; i++) {
    //This could break with too many players
    while (players[i].color == playercolor){
      playercolor = _.sample(colorsArray);
    }
  }

  //Create player
  player = new Player((20*random() + -20*random()), (20*random() + -20*random()), playercolor);

  var data = {
    x: player.position[0],
    y: player.position[1],
    id: player.id,
    velocity: player.velocity,
    color: player.color
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
      ellipse(players[i].x, players[i].y, 5, 5);
    }
  }


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

  for (i = 0; i < racetrack.pointArray.length; i++) {
    isHit = collideLineCircle(racetrack.pointArray[i][0], racetrack.pointArray[i][1], racetrack.pointArray[i][2], racetrack.pointArray[i][3], player.position[0], player.position[1], 15);
    if (isHit === true){
      console.log("You got hit");
      player.velocity = [0, 0];
      player.position = [(20*random() + -20*random()), (20*random() + -20*random())];
    }
  }
  for (i = 0; i < players.length; i++) {
      //console.log(player.id, players[i].userid);
      //console.log(players);
      if (player.id != players[i].userid){
      hitPlayer = collideCircleCircle(player.position[0], player.position[1], 5, players[i].x, players[i].y, 5);
        if (hitPlayer === true && (player.position[0] - players[i].x < 3) && (player.position[1] - players[i].y < 3)){
          player.velocity = [0.05*(player.position[0] - players[i].x), 0.05*(player.position[1] - players[i].y)];

          players[i].velocity = [-0.05*(player.position[0] - players[i].x), -0.05*(player.position[1] - players[i].y)];
        }
        else if(hitPlayer === true){
          //console.log(players);
          //player gets enemy velocity and velocity
          player.velocity = [players[i].velocity[0], players[i].velocity[1]];

          //enemy gets player velocity and velocity
          players[i].velocity = [player.velocity[0], player.velocity[1]];
        }
      }
  }

  //console.log(player.velocity);

  racetrack.show();
  player.show();
  player.update();

  var data = {
    x: player.position[0],
    y: player.position[1],
    velocity: player.velocity
  };

  //Update position on server
  socket.emit('update', data);
}
