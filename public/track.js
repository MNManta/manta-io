function Track() {

  this.pointArray = [-50, 0, 43, -180, -50, 0, 43, 180,
    43, -180, 1000, -180, 43, 180, 1000, 180, 120, -180, 120, -50,
    200, 180, 200, 28];

  this.show = function() {
    for (i = 0; i < this.pointArray.length; i += 4) {
      strokeWeight(10);
      line(this.pointArray[i], this.pointArray[i+1], this.pointArray[i+2], this.pointArray[i+3]);
    }
  };
};
