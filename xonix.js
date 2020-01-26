class Xonix {

	constructor() {
		this.life = LIFE;
		this.score = 0;

		//положение ксоникса на поле (строка-столбец)
		this.col = width/scl - 1;
		this.line = height/scl - 1;
		xonix_coord = [{col: this.col, line: this.line}];


		//скорость передвижение по строкам/столбцам
		this.colSpeed = 1;
		this.lineSpeed = 0;

		//массив клеток в которых был ксоникс при движении по морю
		this.trace = [];

		//параметры состояния
		this.onTheSea = false;
		this.justLeftTheSea = false;
		this.isDead = false;
	}


	//используется при нажатии стрелок
	dir(a, b) {
		let backDir = this.colSpeed == -a || this.lineSpeed == -b;
		if (this.onTheSea && backDir) return;

		this.colSpeed = a;
		this.lineSpeed = b;
	}

	toDefault() {
		this.col = width/scl - 1;
		this.line = height/scl - 1;

		if (this.onTheSea) {
			this.onTheSea = false;
			this.trace.length = 0;
		}

		if (this.isDead) this.isDead = false;
	}

	update(arr) {
		//обновляем положение
		this.col = this.col + this.colSpeed;
		this.line = this.line + this.lineSpeed;

		//чтобы ксоникс не выходил за поле
		if (this.col < 0 || this.col > width/scl - 1) this.col -= this.colSpeed;
		if (this.line < 0 || this.line > height/scl - 1) this.line -= this.lineSpeed;

		xonix_coord = [{col: this.col, line: this.line}];
		//обновляем параметры состояния
		//arr[..][..] == 0 - клетка суши arr[..][..] == 1 - клетка моря
		if (this.onTheSea == false && arr[this.line][this.col] == 1) this.onTheSea = true;
	  else if (this.onTheSea == true && arr[this.line][this.col] == 0) this.justLeftTheSea = true;

		let colDist, lineDist;
		if (this.onTheSea == false || this.justLeftTheSea == true) {
			//enemies_coord[0] - координаты врага на суше, последующие принадлежат врагам в море
			colDist = abs(this.col - enemies_coord[0].col);
			lineDist = abs(this.line - enemies_coord[0].line);
			if (colDist <= 1 && lineDist <= 1) this.isDead = true;
		} else if (this.onTheSea == true) {
			for (let i = 1; i < enemies_coord.length; i++) {
				//проверяем: не касается ли враг на море ксоникса
				colDist = abs(this.col - enemies_coord[i].col);
				lineDist = abs(this.line - enemies_coord[i].line);
				if (colDist <= 1 && lineDist <= 1 ) this.isDead = true;


				for (let j = 0; j < this.trace.length; j++) {
					//проверяем: не касается ли враг следа
					colDist = abs(this.trace[j].col - enemies_coord[i].col);
					lineDist = abs(this.trace[j].line - enemies_coord[i].line);
					if (colDist <= 1 && lineDist <= 1 && this.justLeftTheSea == false) this.isDead = true;

				}
			}

			//не касается ли ксоникс своего следа
			this.trace.forEach(pos => {
				if (pos.col == this.col
				&& pos.line == this.line) this.isDead = true;
			});
		}

		if (this.onTheSea) this.grab(arr);
		//отрисовываем
		this.draw();
	}

	draw() {
		strokeWeight(4);
		strokeJoin(ROUND);

		let fill_color = WHITE;
		let stroke_color = PURPLE;

		if (this.onTheSea == true && this.justLeftTheSea == false) {
			fill_color = PURPLE;
			stroke_color = WHITE;
		}

		stroke(stroke_color);
		fill(fill_color);
		//аргументы rect такие, чтобы ксоникс не вылезал из клетки
		rect(this.col*scl+2, this.line*scl+2, scl-4, scl-4);
	}

	grab(arr) {
		//заливка замкнутых областей как только ксоникс покинет поле
		if (this.justLeftTheSea == true) {
			sound.fill.play();

			let len = this.trace.length;
			let col = this.trace[len-1].col;
			let line = this.trace[len-1].line;

			noStroke();
			fill(PURPLE);
			rect(col*scl, line*scl, scl, scl);

			this.little_magic(arr);
			this.trace.length = 0;
			this.justLeftTheSea = false;

			this.onTheSea = false;
			this.colSpeed = 0;
			this.lineSpeed = 0;
			return;
		}


		//след ксоникса, служит границей при заполнении поля
		this.trace.push({
			col: this.col,
			line: this.line
		});

		//рисуем след без самого ксоникса
		let len = this.trace.length;
		if (len >= 2) {
			let col = this.trace[len-2].col;
			let line = this.trace[len-2].line;

			noStroke();
			fill(PURPLE);
			rect(col*scl, line*scl, scl, scl);
		}



		//если ксоникс умер во время движения по морю,
		//закрашиваем обратно клетки моря
		if (this.isDead == true && this.life > 1) {
			this.trace.forEach(ceil => {
				noStroke();
				fill(BLACK);
				rect(ceil.col*scl, ceil.line*scl, scl, scl);
			});
		}
	}



	//OPUS MAGNUM. Закрашивание полей.



	little_magic(arr) {
		this.trace.forEach(ceil => arr[ceil.line][ceil.col] = 0);

		let launch_point = {}
		for (let i = 1; i < enemies_coord.length; i++) {
			launch_point = enemies_coord[i];
			if (arr[launch_point.line][launch_point.col] == 2) continue;
			this.filling_algorithm(launch_point, arr);
		}

		let sum = 0;
		for (let j = indent; j < height/scl - indent; j++) {
			for (let i = indent; i < width/scl - indent; i++) {
				if (arr[j][i] == 2) arr[j][i] = 1;
			  else if (arr[j][i] == 1) {
					arr[j][i] = 0;
					sum++; //для счета
					xonix_coord.push({col: i, line: j});
				}
			}
		}

		xonix_coord = xonix_coord.concat(this.trace);
		this.make_score(sum);
	}

	make_score(sum) {
		this.score += floor( pow(sum, 1.15) );
	}

	filling_algorithm(start, arr) {
		let gen = [start];
		let bufer = [];
		let line, col;

		while (gen.length != 0) {

			for (let i = 0; i < gen.length; i++) {

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
