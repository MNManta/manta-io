// Setup server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 80;


//This is not used and can be removed
var lerp = require('lerp');

//{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
var lobbies = {};

//var players = {};

var diameter = 20;

var borderdiameter = 1000;

var bordercolor = '#011627';

var borderwidth = 10;

var colorsArray = ['#988B8E', '#140D4F', '#E5C3D1', '#6FEDB7', '#3F26D9', '#E07A5F', '#F2CC8F',
'#6B0504', '#FF84E8', '#414361', '#9EBD6E', "#805D93", "#385F71", "#CF4D6F", "#f44473", "#c91979",
"#190647","#080026","#05221b","#fcbb92","#fbaa68","#fb9755","#7cd8cd","#d4e99b"];

function randKey(obj){
  var keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function Player(x, y, color, diameter, name){
  this.position = [x, y];
  this.velocity = [0,0];
  this.color = color;

  //Remove this?
  this.mass = Math.PI*(diameter/2)*(diameter/2);

  this.diameter = diameter;
  this.name = name;
  this.dead = false;
  this.spectating;
}

function distance(x1, y1, x2, y2){
  return Math.sqrt(((x1 - x2)*(x1 - x2)) + ((y1 - y2)*(y1 - y2)));
}

//Borrowed from p5.collide2D
function collideCircleCircle(x1, y1, d, x2, y2, d2) {
  if(distance(x1,y1,x2,y2) <= (d/2)+(d2/2) ){
    return true;
  }
  return false;
};

//Borrowed from p5.collide2D
function collidePointCircle(x, y, cx, cy, d) {
  //2d
  if(distance(x,y,cx,cy) <= d/2 ){
    return true;
  }
  return false;
};

//Borrowed from p5.collide2D
function collidePointLine(px,py,x1,y1,x2,y2, buffer){
    // get distance from the point to the two ends of the line
  var d1 = distance(px,py, x1,y1);
  var d2 = distance(px,py, x2,y2);

  // get the length of the line
  var lineLen = distance(x1,y1, x2,y2);

  // since floats are so minutely accurate, add a little buffer zone that will give collision
  if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

  // if the two distances are equal to the line's length, the point is on the line!
  // note we use the buffer here to give a range, rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}

//Borrowed from p5.collide2D
function collideLineCircle(x1,  y1,  x2,  y2,  cx,  cy,  diameter) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  var inside1 = collidePointCircle(x1,y1, cx,cy,diameter);
  var inside2 = collidePointCircle(x2,y2, cx,cy,diameter);
  if (inside1 || inside2) return true;

  // get length of the line
  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = Math.sqrt( (distX*distX) + (distY*distY) );

  // get dot product of the line and circle
  var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / (len*len);

  // find the closest point on the line
  var closestX = x1 + (dot * (x2-x1));
  var closestY = y1 + (dot * (y2-y1));

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  var onSegment = collidePointLine(closestX,closestY,x1,y1,x2,y2);
  if (!onSegment) return false;

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  var distance = Math.sqrt( (distX*distX) + (distY*distY) );

  if (distance <= diameter/2) {
    return true;
  }
  return false;
}

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});


function heartbeat(){
  //{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
  for (let room in lobbies){
    if (lobbies[room][2] == false){
      if (lobbies[room][0] == Object.keys(lobbies[room][1]).length){
        lobbies[room][2] = true;
        io.in(room).emit('starting');
        lobbies[room][4] = Date.now();
        io.in(room).emit('heartbeat', [lobbies[room][1], lobbies[room][3], lobbies[room][5]]);
      }
      else{
        io.in(room).emit('waiting', lobbies[room][0] - Object.keys(lobbies[room][1]).length);
        io.in(room).emit('heartbeat', [lobbies[room][1], lobbies[room][3], lobbies[room][5]]);
      }
    }
    else{
      io.in(room).emit('starting');
      var playersalive = 0;
      for (let plyr in lobbies[room][1]){
        if (lobbies[room][1][plyr].dead == false){
          playersalive += 1;
        }
      }
      if (playersalive > 1){
        //{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
        if (lobbies[room][3] > 400){
          //Shrink the border every other five second period
          if (Date.now() - lobbies[room][4] < 5000){
            lobbies[room][5] = bordercolor;
          }
          else if (Date.now() - lobbies[room][4] > 5000 && Date.now() - lobbies[room][4] < 10000){
            lobbies[room][5] = '#DE020A';

            lobbies[room][3] -= 0.1;
          }
          else{
            lobbies[room][4] = Date.now();
          }
        }
        else{
          lobbies[room][5] = bordercolor;
        }

        //Check player collision with the map borderwidth is half because we only care about interior
        for (let key in lobbies[room][1]) {
            isHit = (Math.sqrt(lobbies[room][1][key].position[0]*lobbies[room][1][key].position[0] + lobbies[room][1][key].position[1]*lobbies[room][1][key].position[1]) > ((lobbies[room][3]/2) - (lobbies[room][1][key].diameter/2) - (borderwidth/2)));
            if (isHit === true){
              //console.log("Player " + key + " hit a wall.");
              lobbies[room][1][key].velocity = [0,0];
              lobbies[room][1][key].position = [0,0];
              lobbies[room][1][key].diameter = 0;
              lobbies[room][1][key].dead = true;

              var playerwatch = randKey(lobbies[room][1]);

              while (playerwatch == key || lobbies[room][1][playerwatch].dead == true){
                playerwatch = randKey(lobbies[room][1]);
              }
              lobbies[room][1][key].spectating = playerwatch;
              //io.in(room).emit('heartbeat', [lobbies[room][1], lobbies[room][3], lobbies[room][5]]);
          }
        }

        //Check player-player collision
        for (let key1 in lobbies[room][1]){
          for (let key2 in lobbies[room][1]){
            if (key1 < key2){
              if (lobbies[room][1][key1].dead == false && lobbies[room][1][key2].dead == false){
                hitPlayer = collideCircleCircle(lobbies[room][1][key1].position[0], lobbies[room][1][key1].position[1],
                  lobbies[room][1][key1].diameter, lobbies[room][1][key2].position[0], lobbies[room][1][key2].position[1], lobbies[room][1][key2].diameter);
                if(hitPlayer === true){

                  var prev1 = lobbies[room][1][key1].velocity;

                  lobbies[room][1][key1].velocity = [lobbies[room][1][key2].velocity[0] + 0.05*(lobbies[room][1][key1].position[0] - lobbies[room][1][key2].position[0]),
                                                     lobbies[room][1][key2].velocity[1] + 0.05*(lobbies[room][1][key1].position[1] - lobbies[room][1][key2].position[1])];

                  //Prev1 is necessary so new player velocity doesn't get used
                  lobbies[room][1][key2].velocity = [prev1[0] - 0.05*(lobbies[room][1][key1].position[0] - lobbies[room][1][key2].position[0]),
                                                     prev1[1] - 0.05*(lobbies[room][1][key1].position[1] - lobbies[room][1][key2].position[1])];

                  io.in(room).emit('heartbeat', [lobbies[room][1], lobbies[room][3], lobbies[room][5]]);
                }
              }
            }
          }
        }

        //Update player position
        for (let key in lobbies[room][1]){
          if (lobbies[room][1][key].dead == false){
            //console.log(lobbies[room][1][key].position[0], lobbies[room][1][key].velocity[0]);
            lobbies[room][1][key].position = [lobbies[room][1][key].position[0] + lobbies[room][1][key].velocity[0],
                                    lobbies[room][1][key].position[1] + lobbies[room][1][key].velocity[1]];
          }
          else{
            if (lobbies[room][1][lobbies[room][1][key].spectating] != 'undefined' && lobbies[room][1][lobbies[room][1][key].spectating] != null){
              lobbies[room][1][key].position = lobbies[room][1][lobbies[room][1][key].spectating].position;
            }
          }
        }

        //console.log([lobbies[room][1], lobbies[room][3]]);
        io.in(room).emit('heartbeat', [lobbies[room][1], lobbies[room][3], lobbies[room][5]]);
      }
      else{
        for (let plyr in lobbies[room][1]){
          if (lobbies[room][1][plyr].dead == false){
            lobbies[room][6] = lobbies[room][1][plyr].name;
          }
        }
        //console.log(lobbies[room][1][6]);
        io.in(room).emit('gameover', lobbies[room][6]);
      }
    }
  }
}

//This can be sped up
setInterval(heartbeat, 10);

//{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
function broom(){
  for (let room in lobbies){
    if (Date.now() - lobbies[room][4] > 120000){
      if (Object.keys(lobbies[room][1]).length == 0){
        delete lobbies[room];
      }
      else{
        lobbies[room][4] = Date.now();
      }
    }
  }
  console.log(lobbies);
}

//Clears empty rooms that have not been used in 2 mins (checks every 4 mins)
setInterval(broom, 240000);

// Routing
app.get('/', function(req, res) {
  if (req.query.lobby in lobbies){
    res.sendFile('lobby.html', { root: path.join(__dirname, 'public')})
  }
  else{
    res.sendFile('index.html', { root: path.join(__dirname, 'public')})
  }
});

app.use(express.static(path.join(__dirname, 'public')));



io.on('connection',
  function(socket) {

    var clientid = socket.id;

    var playerlobby;

    socket.on('start',
      function(name) {
        if (typeof lobbies[playerlobby] != null && typeof lobbies[playerlobby] != 'undefined'){
          socket.join(playerlobby);

          //{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
          //When player connects, make a Player object
          //Constructor Player(id, x, y, velocity, color, diameter)
          var playercolor = colorsArray[Math.floor(Math.random() * colorsArray.length)];
          //console.log('Lobby id and lobby', playerlobby, typeof playerlobby, lobbies[playerlobby]);
          numberplayers = Object.keys(lobbies[playerlobby][1]).length;

          //console.log(numberplayers);
          var player = new Player(((0.75 + (Math.random()/100))*(borderdiameter/2))*Math.cos((numberplayers*2*Math.PI)/lobbies[playerlobby][0]),
          ((0.75 + (Math.random()/100))*(borderdiameter/2))*Math.sin((numberplayers*2*Math.PI)/lobbies[playerlobby][0]),
          playercolor, diameter, name);

          lobbies[playerlobby][1][clientid] = player;
          //console.log('playerlobby is', playerlobby);
          //console.log('What is the socket room?', socket.rooms);
          io.in(playerlobby).emit('heartbeat', [lobbies[playerlobby][1], lobbies[playerlobby][3], lobbies[playerlobby][5]]);
          //([lobbies[playerlobby][1], lobbies[playerlobby][3]]);
        }
      }
    );

    socket.on('ready',
      function(data){
        playerlobby = data;
        socket.emit('getID', clientid);
        socket.emit('openlobbies', lobbies);
      }
    );

    socket.on('makelobby',
      function(data){
        //{lobbyid: [size, {players}, started, borderdiameter, timestamp, bordercolor, winner]
        lobbies[data[0]] = [data[1], {}, false, borderdiameter, Date.now(), bordercolor, null];
        //console.log(lobbies);
        socket.emit('openlobbies', lobbies);
      }
    );

    socket.on('joinlobby',
      function(data){
        playerlobby = data;
      }
    );

    socket.on('update',
      function(data) {
        //console.log('from update', typeof lobbies[playerlobby], lobbies[playerlobby][1][clientid]);
        if (typeof lobbies[playerlobby] != null && typeof lobbies[playerlobby] != 'undefined'){
          //console.log(lobbies);
          //console.log(lobbies[playerlobby][3]);
          //console.log('Player info', lobbies[playerlobby][1][clientid].velocity, data);
          lobbies[playerlobby][1][clientid].velocity = data;
          //console.log('After data', lobbies[playerlobby][1][clientid].velocity, data);
          lobbies[playerlobby][1][clientid].position = [lobbies[playerlobby][1][clientid].position[0] + lobbies[playerlobby][1][clientid].velocity[0],
          lobbies[playerlobby][1][clientid].position[1] + lobbies[playerlobby][1][clientid].velocity[1]];
          //console.log(lobbies[playerlobby][1][clientid].position, lobbies[playerlobby][1][clientid].velocity);
          io.in(playerlobby).emit('heartbeat', [lobbies[playerlobby][1], lobbies[playerlobby][3], lobbies[playerlobby][5]]);
          }
      }
    );

    socket.on('disconnect', function(){
      if (lobbies[playerlobby] != null && lobbies[playerlobby] != 'undefined'){
        delete lobbies[playerlobby][1][clientid];
        //console.log(lobbies[playerlobby]);
        if (lobbies[playerlobby][6] == null || lobbies[playerlobby] == 'undefined'){
          io.in(playerlobby).emit('heartbeat', [lobbies[playerlobby][1], lobbies[playerlobby][3], lobbies[playerlobby][5]]);
          //console.log("Player with id " + clientid + " disconnected.");
          //io.to(playerlobby).emit('heartbeat', [lobbies[playerlobby][1], lobbies[playerlobby][3]]);
        }
      }
    }
  );

  }
);
