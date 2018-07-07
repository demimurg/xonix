function seaEnemy() {
	this.col = round( random(2*indent, width/scl - 2*indent) );
	this.line = round( random(2*indent, height/scl - 2*indent) );
	this.colSpeed = random( [-1, 1] );
	this.lineSpeed = random( [-1, 1] );


	this.updateAndDraw = function(arr) {
		if (arr[this.line + this.lineSpeed][this.col + this.colSpeed] == 0 && arr[this.line + this.lineSpeed][this.col] != 0 && arr[this.line][this.col + this.colSpeed] != 0) {
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 0 && arr[this.line][this.col + this.colSpeed] == 0) {
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 0) {
			this.lineSpeed = -this.lineSpeed;
		} else if (arr[this.line][this.col + this.colSpeed] == 0) {
			this.colSpeed = -this.colSpeed;
		}
		
		this.col += this.colSpeed;
		this.line += this.lineSpeed;

		var xc = (this.col + this.col + 1)/2;
		var yc = (this.line + this.line + 1)/2;
		strokeWeight(2);
		stroke(WHITE);
		fill(BLUE);
		ellipse(xc*scl, yc*scl, scl-2);
	}

}

function landEnemy() {
	var COL = 1;
	var LINE = 3;

	this.col = COL;
	this.line = LINE;
	this.colSpeed = 1;
	this.lineSpeed = 1;

	this.updateAndDraw = function(arr) {

		if ( (this.col + this.colSpeed == width/scl || this.col + this.colSpeed == -1) && (this.line + this.lineSpeed == height/scl || this.line + this.lineSpeed == -1) ) {
			this.colSpeed = - this.colSpeed;
			this.lineSpeed = - this.lineSpeed;
		} else if (this.col + this.colSpeed == width/scl ||  this.col + this.colSpeed == -1) {
			this.colSpeed = - this.colSpeed;
		} else if (this.line + this.lineSpeed == height/scl ||  this.line + this.lineSpeed == -1) {
			this.lineSpeed = - this.lineSpeed;
		} else if ( arr[this.line + this.lineSpeed][this.col + this.colSpeed] == 1 && arr[this.line][this.col + this.colSpeed] != 1 && arr[this.line + this.lineSpeed][this.col] != 1 ) {
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if ( arr[this.line + this.lineSpeed][this.col] == 1 && arr[this.line][this.col + this.colSpeed] == 1 ) {
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 1) {
			this.lineSpeed = -this.lineSpeed;
		} else if (arr[this.line][this.col + this.colSpeed] == 1) {
			this.colSpeed = -this.colSpeed;
		}


		this.col += this.colSpeed;
		this.line += this.lineSpeed;

		strokeWeight(2);
		strokeJoin(ROUND);
		stroke(BLACK);
		fill(BLUE);
		rect(this.col*scl+1, this.line*scl+1, scl-2, scl-2);
	}

	this.toDefault = function() {
		this.col = COL;
		this.line = LINE;
	}
}

