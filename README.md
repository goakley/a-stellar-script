a-stellar-script
================

An [A*](http://en.wikipedia.org/wiki/A*_search_algorithm) implementation written in JavaScript.

A* is a heuristic algorithm used for efficient pathfinding/traversal of graphs and grids.  It uses heuristics to estimate the best-case path, and adjusts as necessary.

This implementation works with a few parameters:
* A two-dimentional array
* A set of data that specifies which values in the array are 'untraversable'
* A starting point
* An ending point

The result of this algorithm is an array; the first element contains the starting position.  The nth element contains the next location to traverse to after the n-1th.  The last element is the ending position.

The algorithm only moves in the four cardinal directions (NORTH, EAST, SOUTH, WEST).  This causes the most efficient result to be very predictable, and thus a section of the traversal code is dedicated to randomizing the result of the traversal during execution.  This can be added/removed from the code as necessary (efficiency vs. visual pleasure).