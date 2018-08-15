class seaEnemy {

	constructor() {
		this.col = round( random(2*indent, width/scl - 2*indent) );
		this.line = round( random(2*indent, height/scl - 2*indent) );
		this.colSpeed = random( [-1, 1] );
		this.lineSpeed = random( [-1, 1] );
	}

	//arr[..][..] == 0 - клетка суши arr[..][..] == 1 - клетка моря
	updateAndDraw(arr) {
		if (arr[this.line + this.lineSpeed][this.col] == 0
		&& arr[this.line][this.col + this.colSpeed] == 0) {
			//внешний угол
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line][this.col + this.colSpeed] == 0) {
			//правая или левая грань
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 0) {
			//нижняя или верхняя грань
			this.lineSpeed = -this.lineSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col + this.colSpeed] == 0
			&& arr[this.line + this.lineSpeed][this.col] != 0
			&& arr[this.line][this.col + this.colSpeed] != 0) {
			//внутренний угол
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		}

		this.col += this.colSpeed;
		this.line += this.lineSpeed;

		let xc = (this.col + this.col + 1)/2;
		let yc = (this.line + this.line + 1)/2;

		strokeWeight(4);
		stroke(WHITE);
		fill(BLUE);
		ellipse(xc*scl, yc*scl, scl-4);

		// noStroke();
		// fill(WHITE);
		// rect(this.col*scl, this.line*scl + 2, scl, scl - 4);
		// rect(this.col*scl + 2, this.line*scl, scl - 4, scl);
		//
		// fill(BLUE);
		// rect(this.col*scl + 2, this.line*scl + 2, scl - 4, scl - 4);
	}

}

class landEnemy {

	constructor() {
		this.col = 1;
		this.line = 3;
		this.colSpeed = 1;
		this.lineSpeed = 1;
	}

	//arr[..][..] == 0 - клетка суши arr[..][..] == 1 - клетка моря
	updateAndDraw(arr) {
		if ((this.col + this.colSpeed == width/scl
			|| this.col + this.colSpeed == -1)
		&& (this.line + this.lineSpeed == height/scl
			|| this.line + this.lineSpeed == -1)) {
			//углы суши
			this.colSpeed = -this.colSpeed;
			this.lineSpeed = -this.lineSpeed;
		} else if (this.col + this.colSpeed == width/scl
			|| this.col + this.colSpeed == -1) {
			//правый или левый край
			this.colSpeed = -this.colSpeed;
		} else if (this.line + this.lineSpeed == height/scl
			|| this.line + this.lineSpeed == -1) {
			//верхний или нижний край
			this.lineSpeed = -this.lineSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col + this.colSpeed] == 1
			&& arr[this.line][this.col + this.colSpeed] != 1
			&& arr[this.line + this.lineSpeed][this.col] != 1) {
			//внешний угол моря
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 1
			&& arr[this.line][this.col + this.colSpeed] == 1) {
			//внутренний угол моря
			this.lineSpeed = -this.lineSpeed;
			this.colSpeed = -this.colSpeed;
		} else if (arr[this.line + this.lineSpeed][this.col] == 1) {
			//боковые стороны моря
			this.lineSpeed = -this.lineSpeed;
		} else if (arr[this.line][this.col + this.colSpeed] == 1) {
			//верхняя или нижняя сторона моря
			this.colSpeed = -this.colSpeed;
		}


		this.col += this.colSpeed;
		this.line += this.lineSpeed;

		strokeWeight(4);
		strokeJoin(ROUND);
		stroke(BLACK);
		fill(BLUE);
		rect(this.col*scl+2, this.line*scl+2, scl-4, scl-4);
	}

	toDefault() {
		this.col = 1;
		this.line = 3;
	}
}

let number_of_enemies = 3;
function makeEnemies() {
	enemy = [];
	enemies_coord = [];

	for (let i = 0; i < number_of_enemies; i++) {
		if (i == 0) enemy[i] = new landEnemy();
		else enemy[i] = new seaEnemy();

		enemies_coord.push( {col: enemy[i].col, line: enemy[i].line} );
	}
}


function updateEnemies(arr) {
	for (let i = 0; i < number_of_enemies; i++) {
		enemy[i].updateAndDraw(arr);

		enemies_coord[i].col = enemy[i].col;
		enemies_coord[i].line = enemy[i].line ;
	}

	//обрабатываем столкновения
	for (let i = 1; i < number_of_enemies - 1; i++) {
		for (let j = i + 1; j < number_of_enemies; j++) {
			if ( abs(enemy[i].col - enemy[j].col) <= 1
			&& abs(enemy[i].line - enemy[j].line) <= 1) {
				enemy[i].colspeed = -enemy[i].colspeed;
				enemy[j].lineSpeed = -enemy[j].lineSpeed;
				enemy[j].colspeed = -enemy[j].colspeed;
			}
		}
	}
}
