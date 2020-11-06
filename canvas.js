var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var LineWidth = 10;
var LineHeight = 80;
var boundaryTopOffset = 5;
var boundaryLeftOffset = 2; 
var boundaryPadding = 50;

var leftBoundary = [];
var rightBoundary = [];

window.requestAnimationFrame(draw); 

for (x = 0; x < 8; x++) { 
  leftBoundary[x] = {
    offset: boundaryLeftOffset + 400,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight
  };
}

for (x = 0; x < 8; x++) {
  rightBoundary[x] = {
    offset: boundaryLeftOffset + 1440,
    topOffset: 0,
    width: LineWidth,
    height: LineHeight
  };
}
var cycle = 0,
    totalCycle = LineHeight + boundaryPadding;

function draw() {
    drawCanvas(boundaryLeftOffset-2, 0, canvas.width, canvas.height, 'black');
    cycle = (cycle + 1) % totalCycle;

    for (boundary of [leftBoundary, rightBoundary]) {
        for (i = 0; i < boundary.length; i++) {
            boundary[i].topOffset = cycle + (i-1) * totalCycle;
            drawBoundary(boundary[i], 'white');
        }
    }
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