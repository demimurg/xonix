var number_of_enemys = 3;
function makeEnemys() {
	enemy = [];
	enemys_coord = [];

	for (var i = 0; i < number_of_enemys; i++) {
		if (i == 0) {
			enemy[i] = new landEnemy();
		} else {
			enemy[i] = new seaEnemy();
		}

		enemys_coord.push( {col: enemy[i].col, line: enemy[i].line} );
	}
}


function updateEnemys(arr) {
	for (var i = 0; i < number_of_enemys; i++) {
		enemy[i].updateAndDraw(arr);

		enemys_coord[i].col = enemy[i].col; 
		enemys_coord[i].line = enemy[i].line ;
	}

	//обрабатываем столкновения
	for (var i = 1; i < number_of_enemys - 1; i++) {
		for (var j = i + 1; j < number_of_enemys; j++) {
			if ( abs(enemy[i].col - enemy[j].col) <= 1 && abs(enemy[i].line - enemy[j].line) <= 1) {
				enemy[i].colspeed = -enemy[i].colspeed;
				enemy[j].lineSpeed = -enemy[j].lineSpeed;
				enemy[j].colspeed = -enemy[j].colspeed;
			}
		}
	}
}

var xonix_score = 0;
function game_console() {
	if (seconds_left >= 77 && xonix.life == LIFE) showScores();

	//нарисовать консоль
	noStroke();
	fill(BLACK);
	rect(0, height, width, indent*scl);

	//заполняем консоль
	fill(WHITE);
	textSize(2*scl);

	//счет	
	xonix_score += floor( pow(field.xonix_grab, 2) );
	if (field.xonix_grab < 8 && field.xonix_grab != 0) xonix_score += 30;
	text("Score: " + xonix_score, 0.05 * width, height+17);
	
	//количество жизней
	text("Xn: " + xonix.life, 0.34 * width, height+17);

	//процент захваченного поля
	text("Full: " + field.complete_percent + "%", 0.52 * width, height+17);

	//таймер
	text("Time: " + seconds_left, 0.8 * width, height+17);
}

var highscore_table = [];

function showScores() {
	noStroke();
	fill(BLUE);
	textSize(1.5*scl);
	text("Scores", 70*scl, 4*scl);

	sort( highscore_table );
	reverse ( highscore_table );
	for (var i = 0; i < highscore_table.length; i++) {
		text( highscore_table[i], 70*scl, 6*scl + i*2*scl);
	}
}


//таймер
var seconds_left = set_timer;

var timerId = setInterval(function() {
	seconds_left--;
}, 1000);