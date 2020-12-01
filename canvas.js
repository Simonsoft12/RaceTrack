var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var LineWidth = 10;
var LineHeight = 80;
var boundaryTopOffset = 5;
var boundaryLeftOffset = 2; 
var boundaryPadding = 50;
var boundaryMiddleOffset = 2;
var speed = 50;
let executedTimer = false;
let dateDiff;
let currentScore = 0;
let linespeed = 4;
var cycle = 0, totalCycle = LineHeight + boundaryPadding;

var leftBoundary = [];
var rightBoundary = [];
var middleBoundary = [];
let bullets = [];
var bonuses = [];
var obstacles = [];
var keys = {};

var car = {
  x: 1200,
  y: 800
}

for (x = 0; x < 8; x++) { 
  leftBoundary[x] = 
  {
    offset: boundaryLeftOffset + 400,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "red"
  };
}

for (x = 0; x < 8; x++) { 
  middleBoundary[x] = 
  {
    offset: boundaryMiddleOffset + 890,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "white"
  };
}

for (x = 0; x < 8; x++) {
  rightBoundary[x] = 
  {
    offset: boundaryLeftOffset + 1400,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "red"
  };
}

window.requestAnimationFrame(animate); 

function animate() {

  if(executedTimer == false) {
    obstacles.push({x: Math.floor((Math.random() * 1000) + 450), y: 10});
    timerStart();
  }
  drawCanvas(boundaryLeftOffset-2, 0, canvas.width, canvas.height, 'grey');
  cycle = (cycle + linespeed) % totalCycle;

  for (boundary of [leftBoundary, rightBoundary, middleBoundary]) {
    for (i = 0; i < boundary.length; i++) {
      boundary[i].topOffset = cycle + (i-1) * totalCycle;
      drawBoundary(boundary[i], boundary[i].color);
    }
  }
  if(dateDiff >= 1000) {
    obstacles.push({x: Math.floor((Math.random() * 900) + 490), y: 10});
    bonuses.push({x: Math.floor((Math.random() * 900) + 490), y: 10})
  } 

  drawScore();
  drawObstacle();
  drawBonus();
  DrawBullets();
  MoveBullets();
  obstacleColissionChecker();
  bonusColissionChecker();
  bulletHitObstacle();
  update();
  draw();
  timerCheck();
  
  window.requestAnimationFrame(animate);
}



window.addEventListener('keydown', function (e) {
  let key = event.which
  keys[e.keyCode] = true;
  e.preventDefault();

  if(key === 32) {
    // SPACJA - Strzelanie
    bulletsPush();
  }
});

window.addEventListener('keyup', function (e) {
  delete keys[e.keyCode];
});

function leftKeyPressed() {
  keys[37] = true;
  e.preventDefault();
}

function leftKeyReleased() {
  delete keys[37];
}

function rightKeyPressed() {
  keys[39] = true;
  e.preventDefault();
}

function rightKeyReleased() {
  delete keys[39];
}

function bulletsPush() {
  bullets.push({  x: player.x+50, y: player.y-50 });
}

function drawBoundary(x, elementColor) {
  c.fillStyle = elementColor;
  c.fillRect(x.offset+100, x.topOffset, x.width, x.height);
}

function drawCanvas(posX, posY, width, height, elementColor) {
  c.fillStyle = elementColor;
  c.fillRect(posX, posY, width, height);
}

function timerStart() {
  date1  = new Date();
  executedTimer = true;
}

function timerCheck() {
  var date2  = new Date();
  dateDiff = Math.abs(date1 - date2);
  if(dateDiff >= 1000)date1 = date2;
}

function drawScore() {
  c.font='40px Verdana';
  c.fillStyle = 'hsl('+ 0 +', 90%, 50%)';
  c.fillText('Score : ' + currentScore, 90, 80);    
}

function drawObstacle() {
  c.fillStyle = "#080D23";
  for(obstacle of [obstacles]) {
    for (i = 0; i < obstacles.length; i++) {
      if (obstacles.hasOwnProperty(i)) 
      c.fillRect(obstacle[i].x, obstacle[i].y+= 5, 80, 50);
    }
  }
}

function drawBonus() {
  c.fillStyle = "#F2C14A";
  for(bonus of [bonuses]) {
    for (i = 0; i < bonuses.length; i++) {
      if (bonuses.hasOwnProperty(i)){
        c.beginPath();
        c.arc(bonuses[i].x, bonuses[i].y+= 5, 20, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
      }
    }
  }
}

function obstacleColissionChecker() {
  for (i = 0; i < obstacles.length; i++) {
    if(player.y + 20 - obstacles[i]?.y + 20 > 0 && player.y - 20 - obstacles[i]?.y + 20 < 50 
      && player.x + 50 - obstacles[i]?.x + 20 > 0 && player.x - 50 - obstacles[i]?.x - 20 < 50) {
        currentScore--;
      }
  }
}

function bonusColissionChecker() {
  for (i = 0; i < bonuses.length; i++) {
    if(player.y + 20 - bonuses[i]?.y + 20 > 0 && player.y - 20 - bonuses[i]?.y + 20 < 50 
      && player.x + 50 - bonuses[i]?.x + 20 > 0 && player.x - 50 - bonuses[i]?.x - 20 < 50) {
        currentScore++;
        delete bonuses[i];
      }
  }
}

function bulletHitObstacle() {
  for (let i in bullets) {
    for(let o in obstacles) {
      if(bullets[i].y + 20 - obstacles[o].y + 20 > 0 && bullets[i].y - 25 - obstacles[o].y + 20 < 50 
        && bullets[i].x + 20 - obstacles[o].x + 20 > 0 && bullets[i].x - 50 - obstacles[o].x - 20 < 50 ) {
          delete obstacles[o];
          currentScore += 20;
      }
    }
  }
}

function DrawBullets(){
  for (let i in bullets) {
      if (bullets.hasOwnProperty(i)) {
          c.beginPath();
          c.arc(bullets[i].x, bullets[i].y, 25, 0, 2 * Math.PI);
          c.fillStyle = 'darkorange';
          c.fill();
          c.closePath();
      }
  }
}

function MoveBullets(){
  for (let i in bullets) {
      if (bullets.hasOwnProperty(i)) {
          bullets[i].y -= 7;
      }
  }
}

function Box(options) {
  this.x = options.x || 1100;
  this.y = options.y || 900;
  this.width = options.width || 40;
  this.height = options.height || 50;
  this.color = options.color || '#000000'
  this.speed = options.speed || 5;
  this.direction = options.direction || 'right';
}

var player = new Box({
  X: 10,
  y: 900,
  width: 100,
  height: 50,
  color: '#44ee11',
  speed: 15
});

function input(player) {
  if (37 in keys) {
    player.x -= player.speed;
    player.direction = 'left';
  }
  if (39 in keys) {
    player.x += player.speed;
    player.direction = 'right';
  }
  if (38 in keys) {
    player.y -= player.speed;
    player.direction = 'up';
  }
  if (40 in keys) {
    player.y += player.speed;
    player.direction = 'down';
  }
}

function drawBox(box) {
  c.fillStyle = box.color;
  c.fillRect(box.x, box.y, box.width, box.height);
}

function update() {
  input(player);
}

function draw() {
  drawBox(player);
}