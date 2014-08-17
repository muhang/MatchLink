
//Board contructor
function Board (width, length, endless) {
	this.width = width;
	this.length = length;
	this.numActive = 0;
	this.numCells = 0;
	this.numEmpty = function() {return numCells - numActive};	//FE so only numActive needs to be modified
	this.allCells = [];
	if(endless == true) {
		this.isEndless = true;
	}
	else {
		this.isEndless = false;
	}
}

//Cell constructor
function Cell (x, y) {
	this.x = x;
	this.y = y
}

//Active cell constructor
function ActiveCell (type) {
	this.type = type;
	
}

//Create matrix for pathfinder based on board
var createMatrix = function(board) {
	var matRow = [];
	var matrix = [];
	for(var i = 0; i < gameBoard.height; i++) {
		var matRow = [];
		for (var j = 0; j < gameBoard.width; j++) {
			matRow.push(1);
		}
		matrix.push(matRow);
	}
	return matrix;
};

//Initialization (only endless for now)
function newGame (endlessCheck, level) {
	if (endlessCheck == true) {
		var gameBoard = new Board(6, 6, true);
		var matrix = createMatrix(gameBoard);
		var grid = new PF.Grid(cols,rows,matrix);
	}
	else {
		return false;
	}
}