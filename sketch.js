//игровые параметры
const scl = 20;
const indent = 2;
const fps = 24;
const set_timer = 80;
const LIFE = 3;


//цветовая палитра
const BLACK = '#000000';
const BLUE = '#57afb1';
const PURPLE = '#a236ad';
const WHITE = '#cecaca';

//инициализируем объекты
let field, xonix, enemy;
//здесь хранятся клетки для обновления на очередном шаге
let enemies_coord, xonix_coord;

function setup() {
	let adapt_size = num => {
		while (num % scl != 0) num--;
		return num;
	}
	createCanvas( adapt_size(windowWidth - 10), adapt_size(windowHeight - 10) );
	height -= indent*scl; //отводим место под консоль

	field = new Field();
	xonix = new Xonix();
	makeEnemies(); //new seaEnemy() и new landEnemy()

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
		alert("You Screwed Up \nScore: " + xonix.score);
		//highscore_table.push(xonix_score);
		xonix.life = LIFE;
		xonix.score = 0;

		field.default();
		number_of_enemies = 3;
		makeEnemies();
	}

	//переход на следующий уровень
	if (field.complete_percent >= 75) {
		xonix.score += 500;
		xonix.life++;

		xonix.toDefault();
		enemy[0].toDefault();
		field.default();
		seconds_left = set_timer;

		number_of_enemies++;
		makeEnemies();
	}

	if (seconds_left == 0) {
		alert("Watch the time. \nYou only have " + set_timer + " seconds");
		xonix.isDead = true;
	}

	field.update(enemies_coord, xonix_coord);
	updateEnemies(field.array);
	xonix.update(field.array);

	game_console();
}



let counter = 0;
function keyPressed() {
	//console.log(keyCode);
	if (keyCode === UP_ARROW) xonix.dir(0, -1);
	else if (keyCode === DOWN_ARROW) xonix.dir(0, 1);
	else if (keyCode === RIGHT_ARROW) xonix.dir(1, 0);
	else if (keyCode === LEFT_ARROW) xonix.dir(-1, 0);

	else if (keyCode === 32 && counter%2 == 0) {
		noLoop();
		counter++;

		clearInterval(timer);
	} else if (keyCode === 32 && counter%2 != 0) {
		loop();
		counter++;

		timer = setInterval(() => {seconds_left--;}, 1000);
	}
}

let startX, startY;
function touchStarted() {
	startX = mouseX;
	startY = mouseY;
	return false;
}

function touchEnded() {
	let deltaX = mouseX - startX;
	let deltaY = mouseY - startY;

	if (abs(deltaX) > abs(deltaY)) {
		if (deltaX > 0) xonix.dir(1, 0); //вправо
		else if (deltaX < 0) xonix.dir(-1, 0); //влево
	} else {
		if (deltaY > 0) xonix.dir(0, 1); //вниз
		else if (deltaY < 0) xonix.dir(0, -1); //вверх
	}

	startX = 0, startY = 0;
	return false;
}

//таймер
let seconds_left = set_timer;
let timer = setInterval(() => {seconds_left--;}, 1000);


function game_console() {
	//if (seconds_left >= 77 && xonix.life == LIFE) showScores();

	//нарисовать консоль
	noStroke();
	fill(BLACK);
	rect(0, height, width, indent*scl);

	//заполняем консоль
	fill(WHITE);
	textSize(2*scl);
	let h = height + (5/6)*indent*scl;

	//счет
	text("Score: " + xonix.score, 0.05 * width, h);

	//количество жизней
	text("Xn: " + xonix.life, 0.34 * width, h);

	//процент захваченного поля
	text("Full: " + field.complete_percent + "%", 0.52 * width, h);

	//таймер
	text("Time: " + seconds_left, 0.8 * width, h);
}

// let highscore_table = [];
// function showScores() {
// 	noStroke();
// 	fill(BLUE);
// 	textSize(1.5*scl);
// 	text("Scores", 70*scl, 4*scl);

// 	sort( highscore_table );
// 	reverse ( highscore_table );
// 	for (let i = 0; i < highscore_table.length; i++) {
// 		text( highscore_table[i], 70*scl, 6*scl + i*2*scl);
// 	}
// }
