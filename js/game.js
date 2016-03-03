// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

//Contantes
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;
const ALLPOS = 0;

const SIZEOBJECT = 32;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/gohan.gif";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/DB5.png";

var rockReady = false;
var rockImage = new Image();
rockImage.onload = function(){
	rockReady = true;
};
rockImage.src = "images/stone.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;
var rocks =[];
var nrocks = 10;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var resetHero = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
};

var checkPositionHero = function(obj){
	if ((obj.x - 16) <= (hero.x + 16)
	&& (obj.x + 16) >= (hero.x - 16)
	&& (obj.y - 16) <= (hero.y + 16)
	&& (obj.y + 16) >= (hero.y - 16)
	){
		return false;
	}
	return true;
};

var checkPos = function(pos1, pos2){
	if((pos1 - 16) <= (pos2 + 16)){
		return true;
	}
	return false;
};

var checkPositionRocks = function(obj, pos){
	var rock = {};
	for(i=0; i<nrocks; i++){
		rock = rocks[i];
		if(rock == undefined){
			return false;
		}
		if (checkPos(obj.x, rock.x)
		&& checkPos(rock.x, obj.x)
		&& checkPos(obj.y, rock.y)
		&& checkPos(rock.y, obj.y)
		){
			return  true;
		}
	}
	return false;
};

var isNearRock = function(obj, pos){
	switch (pos){
		case LEFT:
			return nearRock(obj.x-3, obj.y);
			break;
		case RIGHT:
			return nearRock(obj.x+3, obj.y);
			break;
		case UP:
			return nearRock(obj.x, obj.y - 3);
			break;
		case DOWN:
			return nearRock(obj.x, obj.y + 3);
			break;

	}

}

var nearRock = function(x, y){
	for(i=0; i<nrocks; i++){
		if((Math.sqrt(Math.pow((x - rocks[i].x), 2)
					+ Math.pow((y - rocks[i].y), 2))) < 32){
						return false;
					}
	}
	return true;
};


var positionRamdom = function(margin){
		var pos = (Math.random()*(margin - 64));
		if(pos <= 32){
			pos = pos + 32;
		}
		return pos;
};

var resetPrincess = function(){
	// Throw the princess somewhere on the screen randomly
	do{
		princess.x = positionRamdom(canvas.width);
		princess.y = positionRamdom(canvas.height);
	}while(checkPositionRocks(princess, ALLPOS));
};

var resetRocks = function(){
	for(i = 0; i<nrocks; i++){
		var rock = {};
		do{
			rock.x = positionRamdom(canvas.width);
			rock.y = positionRamdom(canvas.height);
		}while(checkPositionRocks(rock, ALLPOS) || !checkPositionHero(rock));
		rocks[i]=rock;
	}
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && isNearRock(hero, UP)) { // Player holding up
		if(hero.y >=(32)){ //Impide que salga por arriba
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y <=((canvas.height-64)) && isNearRock(hero, DOWN)){ //Impide que salga por abajo
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown && isNearRock(hero, LEFT)) { // Player holding left
		if(hero.x >= 32){//Impide salir por la izquierda
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown && isNearRock(hero, RIGHT)) { // Player holding right
		if(hero.x <= ((canvas.width - 64))){ //impide salir por la derecha
			hero.x += hero.speed * modifier;
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		resetPrincess();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

		if(rockReady){
			for(j=0; j<nrocks; j++){
				var rock = {};
				rock = rocks[j];
				ctx.drawImage(rockImage, rock.x, rock.y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
resetHero();
resetRocks();
resetPrincess();

var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
