var socket;
var playerIndex;
var connectionid;

var playername;

var players = {};

var wallwidth = 10;

function Mainmap() {

  this.pointArray = [-594.381123775245, -288.4423115376926, -146.4707058588283, -733.3533293341332, -146.4707058588283, -733.3533293341332, 929.3141371725656, -618.376324735053, 929.3141371725656, -618.376324735053, 1185.2629474105179, 347.4305138972204, 1185.2629474105179, 347.4305138972204, 341.4317136572686, 1075.284943011398, 341.4317136572686, 1075.284943011398, -372.42551489702055, 627.374525094981, -592.381523695261, -280.4439112177565, -673.365326934613, 201.45970805838851, -673.365326934613, 204.4591081783642, -543.3913217356528, 915.3169366126776, -542.3915216956609, 912.3175364927015, 356.42871425714884, 1559.1881623675267, 356.42871425714884, 1559.1881623675267, 967.3065386922617, 1103.2793441311737, 967.3065386922617, 1103.2793441311737, 703.3593281343733, 776.3447310537895, -339.4321135772843, -1085.2829434113178, -339.4321135772843, -973.3053389322135, -336.43271345730864, -1079.2841431713657, -284.44311137772456, -1052.2895420915816, -284.44311137772456, -1052.2895420915816, -257.4485102979402, -1089.2821435712858, -257.4485102979402, -1089.2821435712858, -257.4485102979402, -975.3049390121976, -215.45690861827643, -975.3049390121976, -224.4551089782044, -1082.2835432913416, -219.45610877824447, -1080.2839432113576, -163.46730653869236, -992.3015396920616, -163.46730653869236, -992.3015396920616, -164.46710657868425, -1104.2791441711656, -131.47370525894803, -1006.2987402519495, -121.47570485902816, -1102.2795440911818, -121.47570485902816, -1102.2795440911818, -98.48030393921226, -1065.2869426114776, -98.48030393921226, -1065.2869426114776, -74.48510297940402, -1092.2815436912617, -74.48510297940402, -1092.2815436912617, -72.48550289942023, -997.3005398920216, -290.4419116176764, -891.3217356528694, -284.44311137772456, -790.3419316136772, -284.44311137772456, -887.3225354929014, -254.44911017796449, -887.3225354929014, -254.44911017796449, -885.3229354129173, -254.44911017796449, -862.3275344931014, -254.44911017796449, -862.3275344931014, -278.4443111377723, -838.3323335332932, -278.4443111377723, -838.3323335332932, -248.4503099380122, -822.3355328934213, -248.4503099380122, -822.3355328934213, -276.4447110577885, -794.3411317736452, -212.45750849830029, -830.3339332133573, -232.4535092981405, -807.3385322935412, -232.4535092981405, -807.3385322935412, -204.4591081783642, -799.3401319736051, -204.4591081783642, -831.3337332533492, -183.4633073385321, -794.3411317736452, -207.45850829834035, -799.3401319736051, -188.46230753849204, -808.3383323335333, -150.46990601879634, -874.3251349730053, -150.46990601879634, -805.3389322135572, -161.4677064587081, -830.3339332133573, -140.471905618876, -830.3339332133573, -102.4795040991803, -870.3259348130373, -102.4795040991803, -803.3393321335732, -114.47710457908397, -839.3321335732853, -74.48510297940402, -840.3319336132772, -55.48890221955617, -879.3241351729653, -55.48890221955617, -819.3361327734453, -14.497100579883863, -832.3335332933414, 8.49830033993203, -844.3311337732453, 8.49830033993203, -854.3291341731654, -13.497300539891967, -869.3261347730454, -16.49670065986811, -867.3265346930614, -12.49750049990007, -822.3355328934213, -11.497700459908174, -822.3355328934213, 14.497100579883863, -815.3369326134773, 95.48090381923612, -885.3229354129173, 95.48090381923612, -822.3355328934213, 98.48030393921226, -877.3245350929815, 147.4705058988202, -877.3245350929815, 147.4705058988202, -877.3245350929815, 147.4705058988202, -840.3319336132772, 142.47150569886026, -840.3319336132772, 97.48050389922037, -843.3313337332534, 97.48050389922037, -843.3313337332534, 136.47270545890842, -817.3365326934613, 190.4619076184763, -845.3309338132374, 213.45730853829218, -845.3309338132374, 213.45730853829218, -845.3309338132374, 213.45730853829218, -808.3383323335333, 213.45730853829218, -808.3383323335333, 169.4661067786442, -811.3377324535093, 169.4661067786442, -811.3377324535093, 169.4661067786442, -843.3313337332534, 169.4661067786442, -843.3313337332534, 178.46430713857217, -846.3307338532293, 255.44891021795638, -839.3321335732853, 255.44891021795638, -812.3375324935012, 255.44891021795638, -812.3375324935012, 283.44331133773267, -812.3375324935012, 283.44331133773267, -812.3375324935012, 287.4425114977007, -847.3305338932214, 286.44271145770836, -809.3381323735252, 271.44571085782854, -772.3455308938212, 272.44551089782044, -776.3447310537892, 253.4493101379726, -776.3447310537892, 339.4321135772848, -841.3317336532693, 322.4355128974207, -841.3317336532693, 322.4355128974207, -841.3317336532693, 325.4349130173964, -816.3367326534692, 328.43431313737256, -816.3367326534692, 345.4309138172366, -816.3367326534692, 345.4309138172366, -816.3367326534692, 342.43151369726047, -840.3319336132772, 342.43151369726047, -840.3319336132772, 366.4267146570687, -819.3361327734453, 379.42411517696473, -887.3225354929014, 383.4233153369328, -826.3347330533893, 408.4183163367329, -838.3323335332932, 461.4077184563089, -839.3321335732853, 461.4077184563089, -839.3321335732853, 432.4135172965407, -873.3253349330134, 432.4135172965407, -873.3253349330134, 415.41691661667664, -843.3313337332534, 415.41691661667664, -843.3313337332534, 458.40831833633274, -812.3375324935012, 238.45230953809232, -143.47130573885215, 158.46830633873242, 241.45170965806847, 158.46830633873242, 241.45170965806847, 613.3773245350931, 186.46270745850825, 613.3773245350931, 186.46270745850825, 601.379724055189, -162.4675064987, 601.379724055189, -162.4675064987, 242.45150969806036, -146.4707058588283, -206.45870825834845, -423.4153169366127, 340.4319136172767, -423.4153169366127, -13.497300539891967, 853.3293341331732, 297.4405118976206, 645.3709258148369, 1058.2883423315338, -75.48490301939592, 876.3247350529896, 353.4293141371727, 672.3655268946213, 534.3931213757251, 835.3329334133173, 650.3699260147973, -238.45230953809232, 712.3575284943013, -358.42831433713263, 845.3309338132376, -397.4205158968207, 1023.2953409318138, -233.45330933813239, 839.3321335732853, -100.47990401919606, 796.3407318536292, -232.4535092981405, 966.3067386522698, -273.44531093781234, 1113.277344531094, -131.47370525894803, 927.3145370925818, 24.495100979804192, 884.3231353729257, -102.4795040991803, 1039.2921415716855, -150.46990601879634, 1184.263147370526, -20.49590081983615, 1025.2949410117976, 133.47330533893228, 942.3115376924616, 8.49830033993203, 1097.280543891222, -36.49270145970786, 1276.24475104979, 118.47630473905247, 1079.284143171366, 270.44591081783665, 1039.2921415716855, 126.47470505898809, 1199.2601479704058, 528.3943211357728, 1080.2839432113578, 523.3953209358128, 1142.2715456908618, 591.3817236552691, 1083.283343331334, 587.382523495301, 1157.268546290742, 645.3709258148369, 1087.282543491302, 641.3717256548689, 1163.2673465306939, 517.396520695861, 1194.2611477704459, 509.3981203759249, 1264.247150569886, 584.3831233753249, 1209.2581483703261, 575.3849230153969, 1272.245550889822, 640.371925614877, 1221.2557488502302, 634.3731253749252, 1277.244551089782, 528.3943211357728, 1147.2705458908217, 590.3819236152772, 1215.256948610278, 589.3821235752848, 1152.2695460907821, 640.371925614877, 1221.2557488502302, 508.398320335933, 1260.2479504099183, 556.388722255549, 1314.2371525694862, 556.388722255549, 1314.2371525694862, 630.3739252149571, 1278.2443511297743, 527.3945210957809, 1079.284143171366, 590.3819236152772, 1024.2951409718057, 590.3819236152772, 1024.2951409718057, 640.371925614877, 1078.2843431313736, 640.371925614877, 1169.2661467706462, 618.376324735053, 1185.2629474105179, 520.604120824165, 1192.7385477095418, 529.6059211842366, 1196.739347869574];

  this.show = function() {
    for (i = 0; i < this.pointArray.length; i += 4) {
      strokeWeight(wallwidth);
      line(this.pointArray[i], this.pointArray[i+1], this.pointArray[i+2], this.pointArray[i+3]);
    }
  };
};

function savename() {
    var playername = document.getElementById("usernameinputid").value.trim();
    if (playername.trim().length >= 1){
      document.getElementById("usernameform").remove();
      //Call server to build the player
      socket.emit('start', playername);
    }
}


var gamemap = new Mainmap();

function setup() {
    //Full screen canvas
    createCanvas(windowWidth, windowHeight);

    //Create socket connection
    socket = io();

    socket.on('heartbeat',
      function(data){
        players = data;
      }
    );

    socket.on('getID',
      function(data){
        connectionid = data;
    });

}

function windowResized() {
  //Resizes screen dynamically
  resizeCanvas(windowWidth, windowHeight);
}

//Draw the player
function show(player){
  fill(player.color);
  strokeWeight(0);
  ellipse(player.position[0], player.position[1], player.diameter, player.diameter);
  textAlign(CENTER);
  textFont('Verdana');
  text(player.name, player.position[0], player.position[1] + (1.5*player.diameter));
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
    gamemap.show();

    stroke('#b7897f');
    strokeWeight(1);
    noFill();
    ellipse(0,0, 340, 340);
    stroke(0);


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

    //Update player dictionary
    socket.on('heartbeat', function(data){
      players = data;
    });


    for (let key in players) {
      //console.log(players[key]);
      show(players[key]);
      //console.log(velocity);
    }

    var starttime = new Date().getTime();

    /* for (let key in players) {
      console.log(players[key]);
      show(players[key]);
    } */

    //Check player collision with the map
    for (i = 0; i < gamemap.pointArray.length; i += 4) {
      isHit = collideLineCircle(gamemap.pointArray[i], gamemap.pointArray[i+1], gamemap.pointArray[i+2],
        gamemap.pointArray[i+3], players[connectionid].position[0], players[connectionid].position[1],
         wallwidth + players[connectionid].diameter);
      if (isHit === true){
        console.log("You hit a wall.");
        players[connectionid].velocity = [0,0];
        socket.emit('hitwall');
        socket.on('heartbeat', function(data){
          players = data;
        });
      }
    }
    for (let key in players){
      if (key != connectionid){
        hitPlayer = collideCircleCircle(players[connectionid].position[0], players[connectionid].position[1],
          players[connectionid].diameter, players[key].position[0], players[key].position[1], players[key].diameter);
        //console.log(hitPlayer);
        if(hitPlayer === true){
          //It works leave it alone.
          var xdistance = (players[connectionid].position[0] - players[key].position[0]);
          var ydistance = (players[connectionid].position[1] - players[key].position[1]);
          var distance = (Math.sqrt(Math.pow(Math.abs(xdistance),2) + Math.pow(Math.abs(ydistance),2)));

          players[connectionid].velocity = [0.1*xdistance + players[key].velocity[0], 0.1*ydistance + players[key].velocity[1]];
          socket.emit('hitplayer', players[connectionid].velocity);
          socket.on('heartbeat', function(data){
            players = data;
          });
        }
      }
    }

    var endtime = new Date().getTime();
    var deltatime = (endtime - starttime);
    //console.log(deltatime);
    if (deltatime <= 0){
      deltatime = 1;
    }
    var framerate = 2/deltatime;
    if (framerate >= 60){
      framerate = 60;
    }

    //console.log(players[connectionid].velocity);
    //Update player position on server
    socket.emit('update', [players[connectionid].velocity, framerate]);
  }
}
