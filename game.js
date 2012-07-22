var GRID_WIDTH = 32;
var GRID_HEIGHT = 32;

// --- CANVAS SETUP ---

var canvas = document.getElementById('astar_canvas');
ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(255,255,255)';
ctx.strokeStyle = 'rgb(0,0,0)';

function clearCanvas() {
    var oldFill = ctx.fillStyle;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = oldFill;
}
clearCanvas();

function drawGridBox(x,y) {
    var boxWidth = canvas.width/GRID_WIDTH;
    var boxHeight = canvas.height/GRID_HEIGHT;
    ctx.fillRect(x*boxWidth, y*boxHeight, boxWidth, boxHeight);
}

// -----

// --- VARIABLE SETUP ---

var OPEN = true;
var OBSTACLE = false;

var grid = new Array(GRID_WIDTH);
for (var i = 0; i < GRID_WIDTH; i++) {
    grid[i] = new Array(GRID_HEIGHT);
    for (var j = 0; j < GRID_WIDTH; j++)
	grid[i][j] = OPEN;
}
for (var i = 0; i < (GRID_WIDTH+GRID_HEIGHT); i++) {
    var x = Math.floor(Math.random()*GRID_WIDTH);
    var y = Math.floor(Math.random()*GRID_HEIGHT);
    grid[x][y] = OBSTACLE;
}

var start_point = {x:0,y:0}; // the point at which to start searching from
var goal_point = {x:GRID_WIDTH-1,y:GRID_HEIGHT-1}; // the target point

function drawGrid() {
    var oldFill = ctx.fillStyle;
    for (var i = 0; i < GRID_WIDTH; i++) {
	for (var j = 0; j < GRID_HEIGHT; j++) {
	    if (grid[i][j] == OPEN) {
		ctx.fillStyle='rgb(0,0,0)';
		drawGridBox(i,j);
	    } else {
		ctx.fillStyle = 'rgb(255,0,0)';
		drawGridBox(i,j);
	    }
	}
    }
    ctx.fillStyle = oldFill;
}
drawGrid();
function drawPoints() {
    var oldFill = ctx.fillStyle;
    ctx.fillStyle = 'rgb(0,255,0)';
    drawGridBox(start_point.x, start_point.y);
    ctx.fillStyle = 'rgb(0,0,255)';
    drawGridBox(goal_point.x, goal_point.y);
    ctx.fillStyle = oldFill;
}
drawPoints();

// -----

var open_array = [OPEN];
var solution = astar_calculate_2d(grid, start_point, goal_point, open_array);

drawGrid();
if (solution)
    for (var i = 0; i < solution.length; i++)
	drawGridBox(solution[i].x, solution[i].y);
drawPoints();
