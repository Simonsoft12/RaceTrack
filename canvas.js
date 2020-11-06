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

var leftBoundary = [];
var rightBoundary = [];
var middleBoundary = [];

var car = {
  x: 1200,
  y: 800
}

window.requestAnimationFrame(draw); 

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

function draw() {
    drawCanvas(boundaryLeftOffset-2, 0, canvas.width, canvas.height, 'grey');
    cycle = (cycle + 1) % totalCycle;

    for (boundary of [leftBoundary, rightBoundary, middleBoundary]) {
        for (i = 0; i < boundary.length; i++) {
            boundary[i].topOffset = cycle + (i-1) * totalCycle;
            drawBoundary(boundary[i], boundary[i].color);
        }
    }
    drawCar();
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