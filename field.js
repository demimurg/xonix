function Field() {
	var last_line = height/scl - 1;
	var last_col = width/scl - 1;
 	
 	var previous_percent = 0;
 	this.complete_percent = 0;
 	this.xonix_grab;
	this.array = [];
	
	//1 - море, 0 - суша
	
	this.default = function() {
		this.array.length = 0;
		for (var j = 0; j < height/scl; j++) {
			this.array[j] = [];
			for (var i = 0; i < width/scl; i++) {
				if (i >= indent && j >= indent && i <= last_col - indent && j <= last_line - indent)  {
					this.array[j][i] = 1;
					noStroke();
					fill(BLACK);
					rect(i*scl, j*scl, scl, scl);
				} else {
					this.array[j][i] = 0;
					noStroke();
					fill(BLUE);
					rect(i*scl, j*scl, scl, scl);
				}					
			}
		}
	}


	this.update = function() {
		var sum = 0;
		for (var j = 0; j < height/scl; j++) {
			for (var i = 0; i < width/scl; i++) {
				if (this.array[j][i] == 1) {
					noStroke();
					fill(BLACK);
					rect(i*scl, j*scl, scl, scl);
					sum += 1;
				} else {
					noStroke();
					fill(BLUE);
					rect(i*scl, j*scl, scl, scl);
				}
			}
		}

		//***переделать без использования объекта ксоникса
		previous_percent = this.complete_percent;
		this.complete_percent = floor( 100 - ( (sum + xonix.trace.length) * 100) /( (width/scl - 2*indent) * (height/scl - 2*indent) ) );
		if (previous_percent > this.complete_percent) this.xonix_grab = 0;
		else this.xonix_grab = this.complete_percent - previous_percent;
	}
}

