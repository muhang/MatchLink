
//Constant values
var BOARD_WIDTH = 6;
var BOARD_HEIGHT = 6;
var TOTAL_CELLS = 36;
var ACTIVE_TYPES = ["type1", "type2", "type3", "type4", "type5", "type6", "type7", "type8"];

//Initialize global timer
var timer = 0;

//Initialize game state
var game = true;
var timePlayed = 0;
var paused = false;

//Initialize selection array
var selectedCells = [];

//Initial array of cells in path
var pathCells = [];

//Create matrix for pathfinder based on board
var createMatrix = function() {
	var matRow = [];
	var matrix = [];
	for(var i = 0; i < BOARD_WIDTH; i++) {
		var matRow = [];
		for (var j = 0; j < BOARD_HEIGHT; j++) {
			matRow.push(0);
		}
		matrix.push(matRow);
	}
	return matrix;
};
var pfMatrix = createMatrix();

//initialize grid for pathfinder
var grid = new PF.Grid(BOARD_WIDTH, BOARD_HEIGHT, pfMatrix);

//Board contructor
var board = {
	width: BOARD_WIDTH,
	length: BOARD_HEIGHT,
	cells: [],

	//make new Cell object or child
	makeActive: function(cell, newType) {
		//Remove css class from dom el
		var oldClass = this.cells[cell.y][cell.x].domEl.attr('class').split(' ').pop();
		this.cells[cell.y][cell.x].domEl.removeClass(oldClass);
		//Replace Cell in board.cells
		var temp = this.cells[cell.y][cell.x];
		this.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
		this.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
		//Add class to dom el
		this.cells[cell.y][cell.x].domEl.addClass(newType);
		//Set PF
		grid.setWalkableAt(cell.x, cell.y, false);
		grid.setWalkableAt(cell.x, cell.y, false);
	}, 
	makeEmpty: function(cell) {
		var oldClass = this.cells[cell.y][cell.x].domEl.attr('class').split(' ').pop();
		this.cells[cell.y][cell.x].domEl.removeClass(oldClass);
		var temp = this.cells[cell.y][cell.x];
		this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
		this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
		this.cells[cell.y][cell.x].domEl.addClass("empty");
		grid.setWalkableAt(cell.x, cell.y, true);
		grid.setWalkableAt(cell.x, cell.y, true);
	}, 
	makeBlock: function(cell) {
		var oldClass = this.cells[cell.y][cell.x].domEl.attr('class').split(' ').pop();
		this.cells[cell.y][cell.x].domEl.removeClass(oldClass);
		var temp = this.cells[cell.y][cell.x];
		this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
		this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
		this.cells[cell.y][cell.x].domEl.addClass("block");
		grid.setWalkableAt(cell.x, cell.y, true);
		grid.setWalkableAt(cell.x, cell.y, true);
	}, 
};

//Sets var to new object, params: x, y values of cell in board.cells
var getCell = function(x, y) {
	for (var i = 0; i < board.cells.length; i++) {
		for (var j = 0; j < board.cells[i].length; j++) {
			if (board.cells[i][j].x == x && board.cells[i][j].y == y) {
				return board.cells[i][j];
			}
		}
	}
}

//Cell constructor
function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.type = "empty";
	this.status = 0;
	this.selected = false;
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

//Main game functions

//Empty board.cells and repopulate with new empty Cells
function setCells() {
	board.cells = [];
	for(var i = 0; i < BOARD_HEIGHT; i++) {
		var rowArray = [];
		var newy = i;
		for(var j = 0; j < BOARD_WIDTH; j++) {
			var newx = j;
			var newCell = new Cell(newx, newy);
			newCell.domEl.addClass(newCell.type);
			rowArray.push(newCell);
		}
		board.cells.push(rowArray);
	}
}

function startTimer() {
	setInterval(function(){
		if(paused == false) {
			var generatedType = ACTIVE_TYPES[Math.floor(Math.random()*ACTIVE_TYPES.length)];
			if(timer%2 == 0) {
				generateRandPair(generatedType);
			}
			timer++;
		}
	}, 1000);
}

//Checks for loss then replaces two empty Cells within board with ActiveCells
function generateRandPair(type) {
	if(lossCheck()) {
		//end game
	}
	var emptyCells = [];
	for(var i = 0; i < BOARD_HEIGHT; i++) {
		for(var j = 0; j < BOARD_WIDTH; j++) {
			if(board.cells[i][j].type == "empty") {
				emptyCells.push(board.cells[i][j]);
			}
		}
	}
	var random1 = emptyCells[Math.floor(Math.random()*emptyCells.length)];
	var random2 = emptyCells[Math.floor(Math.random()*emptyCells.length)];
	if(type != "block") {
		board.makeActive(random1, type);
		board.makeActive(random2, type);
	}
	else {
		board.makeBlock(random1);
		board.makeBlock(random2);
	}
}

//Called with startTimer() runs generateRandPair()
function lossCheck() {
	var takenCells = [];
	for(var i = 0; i < BOARD_HEIGHT; i++) {
		for(var j = 0; j < BOARD_WIDTH; j++) {
			if(board.cells[i][j].status == 1 || board.cells[i][j].status == 2) {
				takenCells.push(board.cells[i][j]);
			}
		}
	}
	if(takenCells.length == TOTAL_CELLS) {
		game = false;	//End game
	}
}

//Match handlers

//Simple match if ActiveCells
function typeMatch(cell1, cell2) {
	if(cell1.status == 1 && cell2.status == 1 && cell1.type == cell2.type) {
		return true;
	}
	return false;
}

//Check for match and replace in board.cells with empty Cells
//Executes path animation
function matchCells(cell1, cell2) {
	if(typeMatch(cell1, cell2)) {
		if(getPath(cell1, cell2)) {
			flashPath(pathCells);
			board.makeEmpty(cell1);
			board.makeEmpty(cell2);
		}

	}
	else {
		if(cell1.status == 1 && cell2.status == 1) {
			flashError[cell1, cell2];
		}
		// else {
		// 	if(cell2.status == 2 && cell2.status == 2) {
		// 		//flash error, cells are blocks
		// 	}
		// }
	}
}

//run pathfinder
function getPath(cell1, cell2) {

	//PathfindingJS stuff
	grid.setWalkableAt(cell1.x, cell1.y, true);
	grid.setWalkableAt(cell2.x, cell2.y, true);
	var gridBackup = grid.clone();
	var finder = new PF.AStarFinder();
	var path = finder.findPath(cell1.x, cell1.y, cell2.x, cell2.y, grid);
	grid = gridBackup;

	//Diagonals throw exception
	try{
		var checkTurns = PF.Util.smoothenPath(grid, path);
	}
	catch(err){
		path = [];
		return false;		//Failure
	}

	if(path.length) {
		for(var i = 0; i < path.length; i++) {
			var boardCell = getCell(path[i][0], path[i][1]);
			console.log(boardCell);
			pathCells.push(boardCell);
		}
		console.log(pathCells);
		flashPath(pathCells);
		pathCells = [];
		return true;
	}
	debugger;
	return true;
}


//Event handlers

//Cell click
$('.cell').on("click touchstart", function(e){
	e.preventDefault();
	if(paused == false) {
		for (var i = 0; i < board.cells.length; i++) {
			for (var j = 0; j < board.cells[i].length; j++) {

				if (board.cells[i][j].x == $(this).data("x") && board.cells[i][j].y == $(this).data("y")) {
					var clickedCell = board.cells[i][j];
				}
			}
		}
		if(clickedCell.type == "empty") {
			return false;
		}
		if(selectedCells.length == 0) {
			//First cell selected
			clickedCell.selected = true;
			clickedCell.domEl.addClass("selected");
			selectedCells.push(clickedCell);
		}
		else {
			if (selectedCells.length == 1) {
				//Cell is duplicate
				if(clickedCell.selected == true) {
					selectedCells[0].selected = false;
					selectedCells = [];
					clickedCell.domEl.removeClass("selected");
				}
				else {
					//Cell can be matched
					clickedCell.selected == true;
					clickedCell.domEl.addClass("selected");
					selectedCells.push(clickedCell);
					selectedCells[0].domEl.removeClass("selected");
					selectedCells[1].domEl.removeClass("selected");
					selectedCells[0].selected = false;
					selectedCells[1].selected = false;
					matchCells(selectedCells[0], selectedCells[1]);
					selectedCells = [];
				}
			}
		}
	}
});

//Pause
$('.pause-btn').on("click touchstart", function(e){
	e.preventDefault();
	if(paused == true) {
		$('.board').removeClass('paused');
		paused = false;
	}
	else {
		paused = true;
		$('.board').addClass('paused');
	}
});

//Animations

function flashPath(pathArray) {
	for(var i = 0; i < pathArray.length; i++) {
		(function(i){
			setTimeout(function(){
				pathArray[i].domEl.addClass('pathflash').delay(500).queue(function(next){
					pathArray[i].domEl.removeClass('pathflash').dequeue();
				});
			}, 100 * i);
		}(i));
	}
}

function flashError(array) {
	for (var i = 0; i < array.length; i++) {
		$(array[i]).addClass('error').delay(500).queue(function(next){
			$(this).removeClass('error').dequeue();
		});
	}
}

//Initialization functions

function startEndless() {
	setCells();
	grid = new PF.Grid(BOARD_WIDTH, BOARD_HEIGHT, pfMatrix);
	startTimer();
}

setCells();
startEndless();		//Start