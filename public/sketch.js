var socket;
var playerIndex;
var connectionid;

var playername;

var players = {};

var gamestarted = false;
var gameover = false;
var winner;
var playersleft = 0;

var openlobbies = {};

var borderdiameter;
var bordercolor = '#011627';
var borderwidth = 10;

function gamemap(){
    stroke(bordercolor);
    strokeWeight(borderwidth);
    noFill();
    ellipse(0,0, borderdiameter, borderdiameter);
    stroke(0);
}

function generatelobby() {
    var lobbysize = parseInt(document.getElementById("lobbysize").value.trim());
    if (typeof lobbysize == "number" && lobbysize <= 20){
        document.getElementById("lobbysize").remove();
        document.getElementById("sizeerror").remove();
        var lobbyid = (Math.random()+1).toString(36).substr(2, 6)
        document.getElementById("hostcode").innerHTML = lobbyid.toString();
        socket.emit('makelobby', [lobbyid, lobbysize]);
    }
    else{
      document.getElementById("lobbysize").style.animation = 'shake 0.2s';
      document.getElementById("sizeerror").style.opacity = 1;
    }
}

function joinGame() {
    socket.emit('ready', gamelobby);
    var gamecode = document.getElementById("gamecodeInput").value.trim();
    if ((gamecode in openlobbies)){
      if (Object.keys(openlobbies[gamecode][1]).length + 1 <= openlobbies[gamecode][0]){
        socket.emit('joinlobby', gamecode);
        return true;
      }
      else{
        document.getElementById("gamecodeInput").style.animation = 'shake 0.2s';
        document.getElementById("lobbyerror").innerHTML = "Lobby is full";
        document.getElementById("lobbyerror").style.opacity = 1;
        return false;
      }
    }
    else{
      document.getElementById("gamecodeInput").style.animation = 'shake 0.2s';
      document.getElementById("lobbyerror").innerHTML = "Invalid id";
      document.getElementById("lobbyerror").style.opacity = 1;
      return false;
    }
}

function savename() {
    var gameurl = new URL(document.URL);
    var gamelobby = gameurl.searchParams.get('lobby');

    socket.emit('ready', gamelobby);

    if (gamelobby in openlobbies){
      if (openlobbies[gamelobby][2] == false){
        if (Object.keys(openlobbies[gamelobby][1]).length + 1 <= openlobbies[gamelobby][0]){
          var playername = document.getElementById("usernameinputid").value.trim();
          if (playername.trim().length >= 1){
            document.getElementById("usernameform").remove();
            //Call server to build the player
            socket.emit('start', playername);
          }
        }
        else{
          document.getElementById("usernameform").style.animation = 'shake 0.2s';
          document.getElementById("lobbyfull").innerHTML = "Lobby is full";
          document.getElementById("lobbyfull").style.opacity = 1;
        }
      }
      else{
        document.getElementById("usernameform").style.animation = 'shake 0.2s';
        document.getElementById("lobbyfull").innerHTML = "Lobby is closed";
        document.getElementById("lobbyfull").style.opacity = 1;
      }
    }
    else{
      document.getElementById("usernameform").style.animation = 'shake 0.2s';
      document.getElementById("lobbyfull").innerHTML = "Lobby is closed";
      document.getElementById("lobbyfull").style.opacity = 1;
      //console.log('This returned false');
    }
}

function setup() {

    var gameurl = new URL(document.URL);

    var gamelobby = gameurl.searchParams.get('lobby');

    //Full screen canvas
    createCanvas(windowWidth, windowHeight);

    //Create socket connection
    socket = io();

    socket.emit('ready', gamelobby);

    socket.on('getID',
      function(data){
        connectionid = data;
    });

    socket.on('openlobbies',
      function(data){
        openlobbies = data;
    });


    socket.on('heartbeat',
      function(data){
        players = data[0];
        borderdiameter = data[1];
        bordercolor = data[2];
      }
    );

}

function windowResized() {
  //Resizes screen dynamically
  resizeCanvas(windowWidth, windowHeight);
}

//Draw the player
function show(player){
  if (player.dead == false){
    fill(player.color);
    strokeWeight(0);
    ellipse(player.position[0], player.position[1], player.diameter, player.diameter);
    textAlign(CENTER);
    textFont('Verdana');
    text(player.name, player.position[0], player.position[1] + (1.2*player.diameter));
  }
}


function draw() {
  if (players[connectionid] != null && players[connectionid] != "undefined"
  && players[connectionid] != {}) {

    //console.log(players[connectionid]);

    //Clear canvas.
    clear()

    //Center the game
    translate(width / 2, height / 2);

    //Follow the player
    translate(-players[connectionid].position[0], -players[connectionid].position[1]);

    //Draw the map
    gamemap();

    socket.on('starting', function(){
      gamestarted = true;
    });
    socket.on('waiting', function(data){
      playersleft = data;
    });

    //console.log(players[connectionid].velocity);

    for (let key in players) {
      //console.log(players[key]);
      show(players[key]);
      //console.log(velocity);
    }

    if (gamestarted == true){
      if (gameover == true){
          fill('#011627');
          textSize(36);
          textAlign(CENTER);
          textFont('Verdana');
          text('The winner is ' +  winner, 0,0);
          textSize(12);
      }
      else{
        socket.on('gameover', function(data){
          gameover = true;
          winner = data;
        });

        //Update player dictionary and update border
        socket.on('heartbeat',
          function(data){
            players = data[0];
            borderdiameter = data[1];
            bordercolor = data[2];
          }
        );

        //console.log(gameover, 'Received heartbeat');

        if (players[connectionid].dead == false){
          if (keyIsDown(LEFT_ARROW)) {
            players[connectionid].velocity[0] -= 0.1;
          };

          if (keyIsDown(RIGHT_ARROW)) {
            players[connectionid].velocity[0] += 0.1;
          };

          if (keyIsDown(UP_ARROW)) {
            players[connectionid].velocity[1] -= 0.1;
          };

          if (keyIsDown(DOWN_ARROW)) {
            players[connectionid].velocity[1] += 0.1;
          };
          //console.log(players[connectionid]);
          socket.emit('update', players[connectionid].velocity);
        }
      }
    }
    else{
      fill('#011627');
      textSize(36);
      textAlign(CENTER);
      textFont('Verdana');
      if (playersleft == 1){
        text('Waiting on 1 player...', 0,0);
      }
      else{
        text('Waiting on ' + playersleft + ' players...', 0,0);
      }
      textSize(12);
    }

  }
  else {
    var gameurl = new URL(document.URL);

    var gamelobby = gameurl.searchParams.get('lobby');

    socket.emit('ready', gamelobby);

    socket.on('getID',
      function(data){
        connectionid = data;
    });

    socket.on('openlobbies',
      function(data){
        openlobbies = data;
    });
  }
}
