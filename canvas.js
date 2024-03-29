var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var LineWidth = 10;
var LineHeight = 80;
var boundaryTopOffset = 5;
var boundaryLeftOffset = 2; 
var boundaryPadding = 50;
var boundaryMiddleOffset = 2;
var speed = 55;
let executedTimer = false;
let dateDiff;
let currentScore = 0;
var cycle = 0, totalCycle = LineHeight + boundaryPadding;

let linespeed = 4;
var speedBonus = 5;
var speedObstacle = 5;

var leftBoundary = [];
var rightBoundary = [];
var middleBoundary = [];
var leftCurve = [];
let bullets = [];
var bonuses = [];
var obstacles = [];
var keys = {};

const width = 800;
const height = 600;
const pixelRatio = window.devicePixelRatio || 1;

canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

canvas.mozImageSmoothingEnabled = false;
canvas.imageSmoothingEnabled = false;

c.scale(pixelRatio, pixelRatio);

var car = {
  x: 1200,
  y: 800
}

for (x = 0; x < 8; x++) { 
  leftBoundary[x] = 
  {
    offset: boundaryLeftOffset - 20 ,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "red"
  };
}

leftCurve[0] = 
  {
    offset: boundaryMiddleOffset - 10,
    topOffset: 4,
    width: 320,
    height: 10,
    color: "red"
  };

for (x = 0; x < 8; x++) { 
  middleBoundary[x] = 
  {
    offset: boundaryMiddleOffset + 300,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "white"
  };
}

for (x = 0; x < 8; x++) {
  rightBoundary[x] = 
  {
    offset: boundaryLeftOffset + 600,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight,
    color: "red"
  };
}

window.requestAnimationFrame(animate); 

function animate() {
  if(executedTimer == false) {
    obstacles.push({x: Math.floor((Math.random() * 650) + 30), y: 0});
    timerStart();
  }
  drawCanvas(boundaryLeftOffset - 2, 0, 800, 600, 'grey');
  cycle = (cycle + linespeed) % totalCycle;

  for (boundary of [leftBoundary, rightBoundary, middleBoundary]) {
    for (i = 0; i < boundary.length; i++) {
      boundary[i].topOffset = cycle + (i-1) * totalCycle;
      drawBoundary(boundary[i], boundary[i].color);
    }
  }
  
  if(dateDiff >= 1000) {
    obstacles.push({x: Math.floor((Math.random() * 650) + 30), y: 0});
    bonuses.push({x: Math.floor((Math.random() * 650) + 50), y: 0})
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

function upKeyPressed() {
  keys[38] = true;
  e.preventDefault();
}

function upKeyReleased() {
  delete keys[38];
}

function downKeyPressed() {
  keys[40] = true;
  e.preventDefault();
}

function downKeyReleased() {
  delete keys[40];
}

function bulletsPush() {
  bullets.push({  x: player.x+10, y: player.y-50 });
}

function drawBoundary(x, elementColor) {
  c.fillStyle = elementColor;
    c.fillRect(x.offset+100, x.topOffset, x.width, x.height);
}

function drawCurve(x, elementColor) {
  c.fillStyle = elementColor;
  c.rotate(45 * Math.PI / 30);
  c.fillRect(x.offset+100, x.topOffset, x.width, x.height);
}

function drawCanvas(posX, posY, width, height, elementColor) {
  c.fillStyle = elementColor;
  c.fillRect(posX, posY, width, height);
}

function faster(){
  linespeed++;
  speedBonus++;
  speedObstacle++;
  e.preventDefault();
}

function slower(){
  linespeed--;
  speedBonus--;
  speedObstacle--;
  e.preventDefault();
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
  c.font='22px Comic Sans MS';
  c.fillStyle = 'hsl(100%, 100%, 100%)';
  c.fillText('Score : ', 5, 30);
  c.fillText(currentScore, 20, 60);    
}

function drawObstacle() {
  for(obstacle of [obstacles]) {
    for (i = 0; i < obstacles.length; i++) {
      if (obstacles.hasOwnProperty(i)) {
        var image = document.getElementById("obstacle");
        c.drawImage(image, obstacle[i].x, obstacle[i].y+= speedObstacle);
      }
    }
  }
}

function drawBonus() {
  for(bonus of [bonuses]) {
    for (i = 0; i < bonuses.length; i++) {
      if (bonuses.hasOwnProperty(i)){
        var image = document.getElementById("bonus");
        c.drawImage(image, bonuses[i].x, bonuses[i].y+= speedBonus);
      }
    }
  }
}

function DrawBullets(){
  for (let i in bullets) {
      if (bullets.hasOwnProperty(i)) {
        var image = document.getElementById("bullet");
        c.drawImage(image, bullets[i].x, bullets[i].y);
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

function obstacleColissionChecker() {
  for (i = 0; i < obstacles.length; i++) {
    if(player.y - obstacles[i]?.y > 0 && player.y - obstacles[i]?.y < 50 
      && player.x - obstacles[i]?.x > -50 && player.x - obstacles[i]?.x  < 100) {
        currentScore -= 5;
      }
  }
}

function bonusColissionChecker() {
  for (i = 0; i < bonuses.length; i++) {
    if(player.y - bonuses[i]?.y > 0 && player.y - bonuses[i]?.y < 50 
      && player.x - bonuses[i]?.x > -50 && player.x - bonuses[i]?.x < 50) {
        currentScore += 30;
        delete bonuses[i];
      }
  }
}

function bulletHitObstacle() {
  for (let i in bullets) {
    for(let o in obstacles) {
      if(bullets[i].y - obstacles[o].y > 0 && bullets[i].y - obstacles[o].y < 50 
        && bullets[i].x - obstacles[o].x > -30 && bullets[i].x - obstacles[o].x < 100 ) {
          delete obstacles[o];
          currentScore += 20;
      }
    }
  }
}

function Box(options) {
  this.x = options.x || 450;
  this.y = options.y || 10;
  this.width = options.width || 40;
  this.height = options.height || 50;
  this.color = options.color || '#000000'
  this.speed = options.speed || 5;
  this.direction = options.direction || 'right';
}

var player = new Box({
  X: 100,
  y: 440,
  width: 100,
  height: 50,
  color: '#44ee11',
  speed: 10
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
  var image = document.getElementById("car");
  c.drawImage(image, box.x, box.y);
}

function update() {
  input(player);
}

function draw() {
  drawBox(player);
}
