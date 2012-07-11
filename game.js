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

var start_point = {x:0,y:0}; // the point at which to start searching from
var goal_point = {x:GRID_WIDTH-1,y:GRID_HEIGHT-1}; // the target point

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

Array.prototype.ASTARinsert = function(gridNode) {
    for (var i = 0; i < this.length; i++) {
	if (gridNode.cost < this[i].cost) {
	    this.splice(i, 0, gridNode);
	    return;
	}}
    this.push(gridNode);
}
Array.prototype.ASTARcontains = function(gridNode) {
    for (var i = 0; i < this.length; i++)
	if (gridNode.self_point.x == this[i].self_point.x && 
	    gridNode.self_point.y == this[i].self_point.y)
	    return true;
    return false;
}
Array.prototype.ASTARfetch = function(gridNode) {
    for (var i = 0; i < this.length; i++)
	if (gridNode.self_point.x == this[i].self_point.x && 
	    gridNode.self_point.y == this[i].self_point.y)
	    return this[i];
    return null;
}
Array.prototype.ASTARremove = function(gridNode) {
    for (var i = 0; i < this.length; i++)
	if (gridNode.self_point.x == this[i].self_point.x && 
	    gridNode.self_point.y == this[i].self_point.y)
	    return this.splice(i,1);
    return null;
}

// --- PATHFINDING SETTINGS AND TOOLS ---

var MOVEMENT_COST = 10; // the movement cost from one square to an adjacent one

function GridNode(self_point, parent_point) {
    this.self_point = {x:self_point.x,y:self_point.y};
    this.parent_point = 
	(parent_point ? {x:parent_point.x,y:parent_point.y} : null);
    this.movement = MOVEMENT_COST + (parent_point ? parent_point.movement : 0);
    this.heuristic = (Math.abs(self_point.x-goal_point.x)+
		      Math.abs(self_point.y-goal_point.y))*MOVEMENT_COST;
    this.cost = this.movement+this.heuristic;
}

var open_nodes;
var closed_nodes;

function renderTrace(gridNode) {
    var current = gridNode;
    while (current) {
	drawGridBox(current.self_point.x, current.self_point.y);
	current = 
	    closed_nodes.ASTARfetch(new GridNode(current.parent_point,null));
    }
    drawPoints();
}

// -----

// --- PATHFINDING ALGORITHM ---

function calculatePath() {
    open_nodes = [new GridNode(start_point, null)];
    closed_nodes = [];
    while (open_nodes.length > 0) {
	// get the next node to process
	var current = open_nodes.shift();
	console.log("Testing point " + current.self_point.x + " " + current.self_point.y);
	// check for completion
	if (current.self_point.x == goal_point.x && 
	    current.self_point.y == goal_point.y) {
	    renderTrace(current);
	    return true; // ???
	}
	// close off the current node
	closed_nodes.push(current);
	// get the neighbors of the current node
	var neighbors = [];
	if (current.self_point.x > 0 && 
	    grid[current.self_point.x-1][current.self_point.y])
	    neighbors.push(new GridNode({x:current.self_point.x-1,
					 y:current.self_point.y},
					current.self_point));
	if (current.self_point.y > 0 && 
	    grid[current.self_point.x][current.self_point.y-1])
	    neighbors.push(new GridNode({x:current.self_point.x,
					 y:current.self_point.y-1},
					current.self_point));
	if (current.self_point.x < GRID_WIDTH-1 && 
	    grid[current.self_point.x+1][current.self_point.y])
	    neighbors.push(new GridNode({x:current.self_point.x+1,
					 y:current.self_point.y},
					current.self_point));
	if (current.self_point.y < GRID_HEIGHT-1 && 
	    grid[current.self_point.x][current.self_point.y+1])
	    neighbors.push(new GridNode({x:current.self_point.x,
					 y:current.self_point.y+1},
					current.self_point));
	// shuffle the neighbor order around for fun
	for (var i = 0; i < 4; i++) {
	    var a = Math.floor(Math.random()*neighbors.length);
	    var b = Math.floor(Math.random()*neighbors.length);
	    var temp = neighbors[a];
	    neighbors[a] = neighbors[b];
	    neighbors[b] = temp;
	}
	// iterate through all the neighbors
	for (var i = 0; i < neighbors.length; i++) {
	    // check if the neighbor is closed (should be ignored)
	    if (closed_nodes.ASTARcontains(neighbors[i]))
		continue;
	    // check if the neighbor is in the open set already
	    var neighborShouldBeAdded = 
		!open_nodes.ASTARcontains(neighbors[i]);
	    // just because it's in the open set, doesn't mean...
	    if (!neighborShouldBeAdded) {
		var openNeighbor = open_nodes.ASTARfetch(neighbors[i]);
		// check to see if this neighbor is better
		if (openNeighbor.movement > neighbors[i].movement) {
		    open_nodes.ASTARremove(openNeighbor);
		    neighborShouldBeAdded = true;
		}
	    }
	    if (neighborShouldBeAdded)
		open_nodes.ASTARinsert(neighbors[i]);
	}
    }
    return false;
}

// -----
