// --- ARRAY HELPERS ---

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

// -----

// --- PATHFINDING ALGORITHM ---


function astar_calculate_2d(grid, start, goal, open_array) {
    // --- PATHFINDING SETTINGS AND HELPERS ---
    
    var MOVEMENT_COST = 10; // movement cost from one square to an adjacent
    
    // --- GRID NODE CONSTRUCTOR ---
    function GridNode(self_point, parent_point) {
	this.self_point = {x:self_point.x,y:self_point.y};
	this.parent_point = 
	    (parent_point ? {x:parent_point.x,y:parent_point.y} : null);
	this.movement = MOVEMENT_COST + 
	    (parent_point ? parent_point.movement : 0);
	this.heuristic = (Math.abs(self_point.x-goal_point.x)+
			  Math.abs(self_point.y-goal_point.y))*MOVEMENT_COST;
	this.cost = this.movement+this.heuristic;
    } // -----
    function isOpen(point) {
	for (var i = 0; i < open_array.length; i++)
	    if (point != open_array[i])
		return false;
	return true;
    }

    var open_nodes = [new GridNode(start, null)];
    var closed_nodes = [];

    function buildPathFromNode(node) {
	var current = node;
	var trace = [];
	while (current.parent_point) {
	    trace.unshift({x:current.self_point.x,y:current.self_point.y});
	    current = 
		closed_nodes.ASTARfetch(new GridNode(current.parent_point, 
						     null));
	}
	trace.unshift({x:current.self_point.x,y:current.self_point.y});
	return trace;
    }
    
    // -----
    
    // not needed until in the loop; declaring outside
    var current = undefined;
    
    // loop as long as there are open nodes
    while (open_nodes.length > 0) {
	// get the next node to process
	current = open_nodes.shift();
	// check for completion
	if (current.self_point.x == goal.x && 
	    current.self_point.y == goal.y) {
	    return buildPathFromNode(current); // DONE SUCCESS
	}
	// close off the current node
	closed_nodes.push(current);
	// get the neighbors of the current node
	var neighbors = [];
	if (current.self_point.x > 0 && 
	    isOpen(grid[current.self_point.x-1][current.self_point.y]))
	    neighbors.push(new GridNode({x:current.self_point.x-1,
					 y:current.self_point.y},
					current.self_point));
	if (current.self_point.y > 0 && 
	    isOpen(grid[current.self_point.x][current.self_point.y-1]))
	    neighbors.push(new GridNode({x:current.self_point.x,
					 y:current.self_point.y-1},
					current.self_point));
	if (current.self_point.x < grid.length-1 && 
	    isOpen(grid[current.self_point.x+1][current.self_point.y]))
	    neighbors.push(new GridNode({x:current.self_point.x+1,
					 y:current.self_point.y},
					current.self_point));
	if (current.self_point.y < grid[0].length-1 && 
	    isOpen(grid[current.self_point.x][current.self_point.y+1]))
	    neighbors.push(new GridNode({x:current.self_point.x,
					 y:current.self_point.y+1},
					current.self_point));
	// shuffle the neighbor order around just for fun

	for (var i = 0; i < 8; i++) {
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
    return null; // DONE FAIL
}

