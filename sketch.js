//константы
var scl = 10; 
var indent = 2;
var fps = 20;
var set_timer = 80;
var LIFE = 3;

//цветовая палитра
var BLACK = '#000000';
var BLUE = '#57afb1';
var PURPLE = '#a236ad';
var WHITE = '#cecaca';

//инициализируем объекты
var field, xonix, enemy; 

var enemys_coord;


function setup() {
	createCanvas( 50*scl, (40 + indent)*scl );
	height = 40*scl; //отводим место под консоль

	field = new Field();
	xonix = new Xonix();
	makeEnemys();

	frameRate(fps);
	field.default();
}

function draw() {
	//потеря жизни
	if (xonix.isDead) {
		xonix.life--;
		xonix.toDefault();
		enemy[0].toDefault(); 
		seconds_left = set_timer;
	}

	//дополнительные изменения, если потерял все жизни
	if (xonix.life == 0) {
		alert("You Screwed Up \nScore: " + xonix_score);
		highscore_table.push(xonix_score);
		xonix.life = LIFE;
		xonix_score = 0;

		field.default();
		number_of_enemys = 3;
		makeEnemys();
	}	

	//переход на следующий уровень
	if (field.complete_percent >= 75) {
		xonix_score += 500;
		xonix.life++;
		
		xonix.toDefault();
		enemy[0].toDefault();
		field.default();
		seconds_left = set_timer;
		
		number_of_enemys++;
		makeEnemys();
	}

	if (seconds_left == 0) {
		alert("Watch the time. \nYou only have " + set_timer + " seconds");
		xonix.isDead = true;
	}

	field.update();
	updateEnemys(field.array);
	xonix.update(field.array);
	if (xonix.onTheSea) xonix.grab(field.array);
	game_console();
}


var counter = 0;
function keyPressed() {
	//console.log(keyCode);
	if (keyCode === UP_ARROW) {
		
		if (xonix.onTheSea && xonix.lineSpeed == 1) return;
		xonix.dir(0, -1);

	} else if (keyCode === DOWN_ARROW) {
		
		if (xonix.onTheSea && xonix.lineSpeed == -1) return;
		xonix.dir(0, 1);

	} else if (keyCode === RIGHT_ARROW) {
		
		if (xonix.onTheSea && xonix.colSpeed == -1) return;
		xonix.dir(1, 0);

	} else if (keyCode === LEFT_ARROW) {
		
		if (xonix.onTheSea && xonix.colSpeed == 1) return;
		xonix.dir(-1, 0);

	} else if (keyCode == 32 && counter%2 == 0) {
		noLoop();
		counter++;
		
		clearInterval(timerId);
	} else if (keyCode == 32 && counter%2 != 0) {
		loop();
		counter++;

		timerId = setInterval(function() { seconds_left--; }, 1000);
	}
}







