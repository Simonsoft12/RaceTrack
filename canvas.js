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
let bullets = [];
let linespeed = 4;

var leftBoundary = [];
var rightBoundary = [];
var middleBoundary = [];
var bonuses = [];
var obstacles = [];

var car = {
  x: 1200,
  y: 800
}

document.addEventListener('keydown', function(event) {
  let key = event.which
  if(key === 37) {
    turnLeft();
  } else if(key === 39) {
    turnRight();
  } else if(key === 38) {
    goDown();
  } else if(key === 40) {
    goUp();
  } else if(key === 32) {
    // SPACJA - Strzelanie
    bulletsPush();
}
})

function goDown() {
  car.y -= speed;
}

function goUp() {
  car.y += speed;
}

function turnRight(){
  car.x += speed;
}

function turnLeft(){
  car.x -= speed;
}

function bulletsPush() {
  bullets.push({  x: car.x+50, y: car.y-50 });
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
var cycle = 0,
    totalCycle = LineHeight + boundaryPadding;

window.requestAnimationFrame(draw); 

function draw() {

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
  drawCar();
  DrawBullets();
  MoveBullets();
  obstacleColissionChecker();
  bonusColissionChecker();
  bulletHitObstacle();
  timerCheck();
  window.requestAnimationFrame(draw);
}

function drawBoundary(x, elementColor) {
  c.fillStyle = elementColor;
  c.fillRect(x.offset+100, x.topOffset, x.width, x.height);
}


function drawCanvas(posX, posY, width, height, elementColor) {
  c.fillStyle = elementColor;
  c.fillRect(posX, posY, width, height);
}

function drawCar() {
  c.fillStyle = "blue";
  c.fillRect(car.x, car.y, 100, 150);
  c.fillStyle = "black";
  for(var i = 0; i < 101; i+=100){
    c.beginPath();
    c.ellipse(car.x + i, car.y + 10, 10, 15, Math.PI, 0, 2 * Math.PI);
    c.ellipse(car.x + i, car.y + 140, 10, 15, Math.PI, 0, 2 * Math.PI);
    c.fill();
    c.closePath();
  }
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
  c.font='25px Verdana';
  c.fillStyle = 'hsl('+ 0 +', 100%, 50%)';
  c.fillText('Score : ' + currentScore, 100, 80);    
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
      c.beginPath();
      c.arc(bonuses[i].x, bonuses[i].y+= 5, 20, 0, Math.PI * 2, false);
      c.fill();
      c.closePath();
    }
  }
}

function obstacleColissionChecker() {
  for (i = 0; i < obstacles.length; i++) {
    if(car.y + 20 - obstacles[i]?.y + 20 > 0 && car.y - 20 - obstacles[i]?.y + 20 < 100 
      && car.x + 100 - obstacles[i]?.x + 20 > 0 && car.x - 100 - obstacles[i]?.x - 20 < 200) {
        currentScore--;
      }
  }
}

function bonusColissionChecker() {
  for (i = 0; i < bonuses.length; i++) {
    if(car.y + 20 - bonuses[i]?.y + 20 > 0 && car.y - 20 - bonuses[i]?.y + 20 < 100 
      && car.x + 100 - bonuses[i]?.x + 20 > 0 && car.x - 100 - bonuses[i]?.x - 20 < 200) {
        currentScore++;
      }
  }
}

function bulletHitObstacle() {
  for (let i in bullets) {
    for(let o in obstacles) {
        if(bullets[i].y - 25 - obstacles[o].y - 25 > 0 && bullets[i].y - 25 - obstacles[o].y + 25 < 100 
            && bullets[i].x + 40 - obstacles[o].x + 40 > 0 && bullets[i].x + 40 - obstacles[o].x + 40 < 100
            ) {
            delete obstacles[o];
            currentScore+=20;
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