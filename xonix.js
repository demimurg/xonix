function Xonix() {

	var COL = width/scl - 1;
	var LINE = height/scl - 1;

	this.life = LIFE;
	//this.score = 0;

	//положение ксоникса на поле (строка-столбец)
	this.col = COL;
	this.line = LINE;


	//скорость передвижение по строкам/столбцам
	this.colSpeed = 1;
	this.lineSpeed = 0;

	//массив клеток в которых был ксоникс при движении по морю
	this.trace = [];

	//параметры состояния
	this.onTheSea = false;
	this.justLeftTheSea = false;
	this.isDead = false;


	this.toDefault = function() {
		this.col = COL;
		this.line = LINE;
		this.onTheSea = false;
		this.trace.length = 0;

		if (this.isDead == true) this.isDead = false;
	}

	//используется при нажатии стрелок
	this.dir = function(a, b) {
		this.colSpeed = a;
		this.lineSpeed = b;
	}

	this.update = function(arr) {
		//обновляем положение
		this.col = this.col + this.colSpeed;
		this.line = this.line + this.lineSpeed;

		//чтобы ксоникс не выходил за поле
		this.col = constrain(this.col, 0, width/scl-1);
		this.line = constrain(this.line, 0, height/scl-1);


		//обновляем параметры состояния

		//arr[..][..] == 0 - клетка суши arr[..][..] == 1 - клетка моря 
		if (arr[this.line][this.col] == 1) this.onTheSea = true;
		if (this.onTheSea == true && arr[this.line][this.col] == 0) this.justLeftTheSea = true;

		//enemys_coord[0] - координаты врага на суше, последующие принадлежат врагам в море 
		for (var i = 0; i < enemys_coord.length; i++) {
			if ( abs(this.col - enemys_coord[i].col) <= 1 && abs(this.line - enemys_coord[i].line) <= 1 ) {
				if ( (i == 0 && this.onTheSea == false) || (i > 0 && this.onTheSea == true) ) this.isDead = true;
			}	
		} 

		//ксоникс погибает если враг в море коснулся следа
		for (var i = 0; i < this.trace.length; i++) {
			for (var j = 1; j < enemys_coord.length; j++) {
				if ( abs(this.trace[i].col - enemys_coord[j].col) <= 1 && abs(this.trace[i].line - enemys_coord[j].line) <= 1 && this.justLeftTheSea == false) this.isDead = true;	
			}
		}

		//ксоникс не может касаться своего следа
		//меняем параметр justLeftTheSea, чтобы не сработало заполнение замкнутой области в функции grab
		for (var i = 0; i < this.trace.length; i++) {
			if (this.trace[i].col == this.col && this.trace[i].line == this.line) {
				this.isDead = true;
				this.justLeftTheSea = false;
			}	
		}


		//отрисовываем
		this.draw();
	}

	this.draw = function() {
		strokeWeight(2);
		strokeJoin(ROUND);

		var fill_color = WHITE;
		var stroke_color = PURPLE;

		if (this.onTheSea == true && this.justLeftTheSea == false) {
			fill_color = PURPLE;
			stroke_color = WHITE;
		}

		stroke(stroke_color);
		fill(fill_color);
		//аргументы rect такие, чтобы ксоникс не вылезал из клетки
		rect(this.col*scl+1, this.line*scl+1, scl-2, scl-2);
	}

	this.grab = function(arr) {
		//заливка замкнутых областей как только ксоникс покинет поле
		if (this.justLeftTheSea == true) {
			this.little_magic(arr);
			this.trace.length = 0;
			this.justLeftTheSea = false;

			this.onTheSea = false;
			this.colSpeed = 0;
			this.lineSpeed = 0;
			return;
		}


		//след ксоникса, служит границей при заполнении поля
		arr[this.line][this.col] = 0;
		this.trace.push({
			col: this.col,
			line: this.line
		});

		//рисуем след без самого ксоникса
		for (var i = 0; i < this.trace.length - 1; i++) {
			fill(PURPLE);
			noStroke();
			rect(this.trace[i].col*scl, this.trace[i].line*scl, scl, scl);
		}


		//если ксоникс умер во время движения по морю, следу надо вернуть единичные значения
		if (this.isDead == true && this.life != 0) {
			for (var i = 0; i < this.trace.length; i++) {
				arr[this.trace[i].line][this.trace[i].col] = 1;
			}
			this.draw(); //иначе, след закрашивает ксоникса 
		}
	}



	//OPUS MAGNUM. Закрашивание полей.
	


	this.little_magic = function(arr) {
		var launch_point = {};

		for (var i = 1; i < enemys_coord.length; i++) {
			launch_point = enemys_coord[i];
			if (arr[launch_point.line][launch_point.col] == 2) continue;
			this.filling_algorithm(launch_point, arr);
		}

		for (var j = indent; j < height/scl - indent; j++) {
			for (var i = indent; i < width/scl - indent; i++) {
				if (arr[j][i] == 2) arr[j][i] = 1;
				else if (arr[j][i] == 1) arr[j][i] = 0;
			}
		}

	}

	
	this.filling_algorithm = function(start, arr) {
		var gen = [start];
		var bufer = [];
		var line, col;


		while (gen.length != 0) {
			
			for (var i = 0; i < gen.length; i++) {

				line = gen[i].line;
				col = gen[i].col;


				if (arr[line+1][col] == 1) {
					bufer.push( {line: line+1, col: col} );
					arr[line+1][col] = 2;
				}

				if (arr[line-1][col] == 1) {
					bufer.push( {line: line-1, col: col} );
					arr[line-1][col] = 2;
				}

				if (arr[line][col+1] == 1) {
					bufer.push( {line: line, col: col+1} );
					arr[line][col+1] = 2;
				}

				if (arr[line][col-1] == 1) {
					bufer.push( {line: line, col: col-1} );
					arr[line][col-1] = 2;
				}

			}

			gen = bufer;
			bufer = [];

		}
	}

}



