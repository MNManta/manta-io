// Setup server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 80;

var lerp = require('lerp');

var players = {};

var gamemap = [-594.381123775245, -288.4423115376926, -146.4707058588283, -733.3533293341332, -146.4707058588283, -733.3533293341332, 929.3141371725656, -618.376324735053, 929.3141371725656, -618.376324735053, 1185.2629474105179, 347.4305138972204, 1185.2629474105179, 347.4305138972204, 341.4317136572686, 1075.284943011398, 341.4317136572686, 1075.284943011398, -372.42551489702055, 627.374525094981, -592.381523695261, -280.4439112177565, -673.365326934613, 201.45970805838851, -673.365326934613, 204.4591081783642, -543.3913217356528, 915.3169366126776, -542.3915216956609, 912.3175364927015, 356.42871425714884, 1559.1881623675267, 356.42871425714884, 1559.1881623675267, 967.3065386922617, 1103.2793441311737, 967.3065386922617, 1103.2793441311737, 703.3593281343733, 776.3447310537895, -339.4321135772843, -1085.2829434113178, -339.4321135772843, -973.3053389322135, -336.43271345730864, -1079.2841431713657, -284.44311137772456, -1052.2895420915816, -284.44311137772456, -1052.2895420915816, -257.4485102979402, -1089.2821435712858, -257.4485102979402, -1089.2821435712858, -257.4485102979402, -975.3049390121976, -215.45690861827643, -975.3049390121976, -224.4551089782044, -1082.2835432913416, -219.45610877824447, -1080.2839432113576, -163.46730653869236, -992.3015396920616, -163.46730653869236, -992.3015396920616, -164.46710657868425, -1104.2791441711656, -131.47370525894803, -1006.2987402519495, -121.47570485902816, -1102.2795440911818, -121.47570485902816, -1102.2795440911818, -98.48030393921226, -1065.2869426114776, -98.48030393921226, -1065.2869426114776, -74.48510297940402, -1092.2815436912617, -74.48510297940402, -1092.2815436912617, -72.48550289942023, -997.3005398920216, -290.4419116176764, -891.3217356528694, -284.44311137772456, -790.3419316136772, -284.44311137772456, -887.3225354929014, -254.44911017796449, -887.3225354929014, -254.44911017796449, -885.3229354129173, -254.44911017796449, -862.3275344931014, -254.44911017796449, -862.3275344931014, -278.4443111377723, -838.3323335332932, -278.4443111377723, -838.3323335332932, -248.4503099380122, -822.3355328934213, -248.4503099380122, -822.3355328934213, -276.4447110577885, -794.3411317736452, -212.45750849830029, -830.3339332133573, -232.4535092981405, -807.3385322935412, -232.4535092981405, -807.3385322935412, -204.4591081783642, -799.3401319736051, -204.4591081783642, -831.3337332533492, -183.4633073385321, -794.3411317736452, -207.45850829834035, -799.3401319736051, -188.46230753849204, -808.3383323335333, -150.46990601879634, -874.3251349730053, -150.46990601879634, -805.3389322135572, -161.4677064587081, -830.3339332133573, -140.471905618876, -830.3339332133573, -102.4795040991803, -870.3259348130373, -102.4795040991803, -803.3393321335732, -114.47710457908397, -839.3321335732853, -74.48510297940402, -840.3319336132772, -55.48890221955617, -879.3241351729653, -55.48890221955617, -819.3361327734453, -14.497100579883863, -832.3335332933414, 8.49830033993203, -844.3311337732453, 8.49830033993203, -854.3291341731654, -13.497300539891967, -869.3261347730454, -16.49670065986811, -867.3265346930614, -12.49750049990007, -822.3355328934213, -11.497700459908174, -822.3355328934213, 14.497100579883863, -815.3369326134773, 95.48090381923612, -885.3229354129173, 95.48090381923612, -822.3355328934213, 98.48030393921226, -877.3245350929815, 147.4705058988202, -877.3245350929815, 147.4705058988202, -877.3245350929815, 147.4705058988202, -840.3319336132772, 142.47150569886026, -840.3319336132772, 97.48050389922037, -843.3313337332534, 97.48050389922037, -843.3313337332534, 136.47270545890842, -817.3365326934613, 190.4619076184763, -845.3309338132374, 213.45730853829218, -845.3309338132374, 213.45730853829218, -845.3309338132374, 213.45730853829218, -808.3383323335333, 213.45730853829218, -808.3383323335333, 169.4661067786442, -811.3377324535093, 169.4661067786442, -811.3377324535093, 169.4661067786442, -843.3313337332534, 169.4661067786442, -843.3313337332534, 178.46430713857217, -846.3307338532293, 255.44891021795638, -839.3321335732853, 255.44891021795638, -812.3375324935012, 255.44891021795638, -812.3375324935012, 283.44331133773267, -812.3375324935012, 283.44331133773267, -812.3375324935012, 287.4425114977007, -847.3305338932214, 286.44271145770836, -809.3381323735252, 271.44571085782854, -772.3455308938212, 272.44551089782044, -776.3447310537892, 253.4493101379726, -776.3447310537892, 339.4321135772848, -841.3317336532693, 322.4355128974207, -841.3317336532693, 322.4355128974207, -841.3317336532693, 325.4349130173964, -816.3367326534692, 328.43431313737256, -816.3367326534692, 345.4309138172366, -816.3367326534692, 345.4309138172366, -816.3367326534692, 342.43151369726047, -840.3319336132772, 342.43151369726047, -840.3319336132772, 366.4267146570687, -819.3361327734453, 379.42411517696473, -887.3225354929014, 383.4233153369328, -826.3347330533893, 408.4183163367329, -838.3323335332932, 461.4077184563089, -839.3321335732853, 461.4077184563089, -839.3321335732853, 432.4135172965407, -873.3253349330134, 432.4135172965407, -873.3253349330134, 415.41691661667664, -843.3313337332534, 415.41691661667664, -843.3313337332534, 458.40831833633274, -812.3375324935012, 238.45230953809232, -143.47130573885215, 158.46830633873242, 241.45170965806847, 158.46830633873242, 241.45170965806847, 613.3773245350931, 186.46270745850825, 613.3773245350931, 186.46270745850825, 601.379724055189, -162.4675064987, 601.379724055189, -162.4675064987, 242.45150969806036, -146.4707058588283, -206.45870825834845, -423.4153169366127, 340.4319136172767, -423.4153169366127, -13.497300539891967, 853.3293341331732, 297.4405118976206, 645.3709258148369, 1058.2883423315338, -75.48490301939592, 876.3247350529896, 353.4293141371727, 672.3655268946213, 534.3931213757251, 835.3329334133173, 650.3699260147973, -238.45230953809232, 712.3575284943013, -358.42831433713263, 845.3309338132376, -397.4205158968207, 1023.2953409318138, -233.45330933813239, 839.3321335732853, -100.47990401919606, 796.3407318536292, -232.4535092981405, 966.3067386522698, -273.44531093781234, 1113.277344531094, -131.47370525894803, 927.3145370925818, 24.495100979804192, 884.3231353729257, -102.4795040991803, 1039.2921415716855, -150.46990601879634, 1184.263147370526, -20.49590081983615, 1025.2949410117976, 133.47330533893228, 942.3115376924616, 8.49830033993203, 1097.280543891222, -36.49270145970786, 1276.24475104979, 118.47630473905247, 1079.284143171366, 270.44591081783665, 1039.2921415716855, 126.47470505898809, 1199.2601479704058, 528.3943211357728, 1080.2839432113578, 523.3953209358128, 1142.2715456908618, 591.3817236552691, 1083.283343331334, 587.382523495301, 1157.268546290742, 645.3709258148369, 1087.282543491302, 641.3717256548689, 1163.2673465306939, 517.396520695861, 1194.2611477704459, 509.3981203759249, 1264.247150569886, 584.3831233753249, 1209.2581483703261, 575.3849230153969, 1272.245550889822, 640.371925614877, 1221.2557488502302, 634.3731253749252, 1277.244551089782, 528.3943211357728, 1147.2705458908217, 590.3819236152772, 1215.256948610278, 589.3821235752848, 1152.2695460907821, 640.371925614877, 1221.2557488502302, 508.398320335933, 1260.2479504099183, 556.388722255549, 1314.2371525694862, 556.388722255549, 1314.2371525694862, 630.3739252149571, 1278.2443511297743, 527.3945210957809, 1079.284143171366, 590.3819236152772, 1024.2951409718057, 590.3819236152772, 1024.2951409718057, 640.371925614877, 1078.2843431313736, 640.371925614877, 1169.2661467706462, 618.376324735053, 1185.2629474105179, 520.604120824165, 1192.7385477095418, 529.6059211842366, 1196.739347869574];


var diameter = 12;

var wallwidth = 10;

var colorsArray = ['#988B8E', '#140D4F', '#E5C3D1', '#6FEDB7', '#3F26D9', '#E07A5F', '#F2CC8F',
'#6B0504', '#FF84E8', '#414361', '#9EBD6E', "#805D93", "#385F71", "#CF4D6F"];

var playercolor;

function Player(x, y, color, diameter, name){
  this.position = [x, y];
  this.velocity = [0,0];
  this.color = color;
  this.mass = Math.PI*(diameter/2)*(diameter/2);
  this.diameter = diameter;
  this.name = name;
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
    //Check player collision with the map
    for (let key in players) {
      for (i = 0; i < gamemap.length; i += 4) {
        isHit = collideLineCircle(gamemap[i], gamemap[i+1], gamemap[i+2],
          gamemap[i+3], players[key].position[0], players[key].position[1],
           wallwidth + players[key].diameter);
        if (isHit === true){
          //console.log("Player " + key + " hit a wall.");
          players[key].velocity = [0,0];
          players[key].position = [10*diameter*Math.random()*2 - 10*diameter, 10*diameter*Math.random()*2 - 10*diameter];
          io.emit('heartbeat', players);
        }
      }
    }

    //Check player-player collision
    for (let key1 in players){
      for (let key2 in players){
        if (key1 < key2){
          hitPlayer = collideCircleCircle(players[key1].position[0], players[key1].position[1],
            players[key1].diameter, players[key2].position[0], players[key2].position[1], players[key2].diameter);
          if(hitPlayer === true){
            //console.log("Player " + key1 + " hit Player " + key2);
            //console.log("Previous velocity for " + key1 +': ' + players[key1].velocity);
            //console.log("Previous velocity for " + key2 +': ' + players[key2].velocity);

            var prev1 = players[key1].velocity;
            //console.log(players[key1].position, players[key1].velocity, players[key2].position, players[key2].velocity);
            players[key1].velocity = players[key2].velocity;
            //Prev1 is necessary so new player velocity doesn't get used
            players[key2].velocity = prev1;
            //console.log("New velocity for " + key1 +': ' + players[key1].velocity);
            //console.log("New velocity for " + key2 +': ' + players[key2].velocity);
            io.emit('heartbeat', players);
          }
        }
      }
    }

    //Update player position
    for (let key in players){
      players[key].position = [players[key].position[0] + players[key].velocity[0],
                              players[key].position[1] + players[key].velocity[1]];
      //console.log(players[key].position, players[key].velocity);
    }

    io.emit('heartbeat', players);
    //console.log(players);
}

setInterval(heartbeat, 1);

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
      }
    );

    socket.on('update',
      function(data) {
        if (typeof players[clientid] !== "undefined"){
          players[clientid].velocity = data;
          //Check player collision with the map
          for (let key in players) {
            for (i = 0; i < gamemap.length; i += 4) {
              isHit = collideLineCircle(gamemap[i], gamemap[i+1], gamemap[i+2],
                gamemap[i+3], players[key].position[0], players[key].position[1],
                 wallwidth + players[key].diameter);
              if (isHit === true){
                //console.log("Player " + key + " hit a wall.");
                players[key].velocity = [0,0];
                players[key].position = [10*diameter*Math.random()*2 - 10*diameter, 10*diameter*Math.random()*2 - 10*diameter];
                io.emit('heartbeat', players);
              }
            }
          }

          //Check player-player collision
          for (let key1 in players){
            for (let key2 in players){
              if (key1 < key2){
                hitPlayer = collideCircleCircle(players[key1].position[0], players[key1].position[1],
                  players[key1].diameter, players[key2].position[0], players[key2].position[1], players[key2].diameter);
                if(hitPlayer === true){
                  //console.log("Player " + key1 + " hit Player " + key2);
                  //console.log("Previous velocity for " + key1 +': ' + players[key1].velocity);
                  //console.log("Previous velocity for " + key2 +': ' + players[key2].velocity);

                  var prev1 = players[key1].velocity;
                  //console.log(players[key1].position, players[key1].velocity, players[key2].position, players[key2].velocity);
                  players[key1].velocity = players[key2].velocity;
                  //Prev1 is necessary so new player velocity doesn't get used
                  players[key2].velocity = prev1;
                  //console.log("New velocity for " + key1 +': ' + players[key1].velocity);
                  //console.log("New velocity for " + key2 +': ' + players[key2].velocity);
                  io.emit('heartbeat', players);
                }
              }
            }
          }

          //Update player position
          for (let key in players){
            players[key].position = [players[key].position[0] + players[key].velocity[0],
                                    players[key].position[1] + players[key].velocity[1]];
            //console.log(players[key].position, players[key].velocity);
          }

          io.emit('heartbeat', players);
          //console.log(players);
        }
      }
    );

    socket.on('disconnect', function(){
        delete players[clientid];
        //console.log("Player with id " + clientid + " disconnected.");
        socket.emit('heartbeat', players);
      }
    );

  }
);
