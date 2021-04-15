function Track() {

  this.pointArray = [[-200,-50,200,-50], [-200,250,200,250], [-100,50,100,50],
  [-100,150,100,150], [100,50, 100, 150], [-100,50, -100, 150],
  [-200,-50,-200,250], [200,-50,200,250]];

  this.show = function() {
    for (i = 0; i < this.pointArray.length; i++) {
      strokeWeight(10);
      line(this.pointArray[i][0], this.pointArray[i][1], this.pointArray[i][2], this.pointArray[i][3]);
    }
  };
};
