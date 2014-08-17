
//Constant values
var BOARD_WIDTH = 6;
var BOARD_HEIGHT = 6;
var TOTAL_CELLS = 36;

// Create matrix for pathfinder based on board
// var createMatrix = function() {
// 	var matRow = [];
// 	var matrix = [];
// 	for(var i = 0; i < BOARD_WIDTH; i++) {
// 		var matRow = [];
// 		for (var j = 0; j < BOARD_HEIGHT; j++) {
// 			matRow.push(0);
// 		}
// 		matrix.push(matRow);
// 	}
// 	return matrix;
// };

// //initialize grid for pathfinder
// var grid = new PF.Grid();

//Board contructor
var board = {
	width: BOARD_WIDTH,
	length: BOARD_HEIGHT,
	cells: [],
	numEmpty: function() {
		return TOTAL_CELLS - this.numActive;
	},	//FE so only numActive needs to be modified
	makeActive: function(cell, newType) {
		var i = cells.indexOf(cell);
		var temp = cells[i];
		cells[i] = new ActiveCell(temp.x, temp.y, newType);
	}, 
	makeEmpty: function(cell) {
		var i = cells.indexOf(cell);
		var temp = cells[i];
		cells[i] = new Cell(temp.x, temp.y, newType);
	}, 
	makeBlock: function(cell) {
		var i = cells.indexOf(cell);
		var temp = cells[i];
		cells[i] = new BlockCell(temp.x, temp.y, newType);
	}, 
};

//Cell constructor
function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.type = "empty";
	this.status = 0;
	this.domEl = $('.row' + y + ' .col' + x);
}

//Active cell 
ActiveCell.prototype = new Cell();
ActiveCell.prototype.constructor = ActiveCell;
function ActiveCell(x, y, type) {
	Cell.apply(this, arguments);	
	this.type = type;
	this.status = 1;
}

//Blocked cell constructor
BlockCell.prototype = new Cell();
BlockCell.prototype.constructor = BlockCell;
function BlockCell(x, y) {
	Cell.apply(this, arguments)
	this.type = "block";
	this.status = 2;
}

function setCells() {
	board.cells = [];
	for(var i = 0; i < TOTAL_CELLS; i++) {
		var newx = i%BOARD_WIDTH;
		var newy = Math.floor(i/BOARD_HEIGHT);
		var newCell = new Cell(newx, newy);

		//Give each newCell property that 
		board.cells.push(newCell);
	}
	debugger;
};

setCells();

function startGame() {
	// grid = new PH.Grid(cols,rows,matrix);
}