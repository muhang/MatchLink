//require game.js
//requires canvas.js
//All patherfinder.js related code disabled

//startTimer

//Game object - export

function Game() {
    this.activeTypes = [];
    this.timer = 0;
    this.isActive = false;
    this.timePlayed = 0;
    this.pause = false;
    this.board = [];
}

Game.prototype.startTimer = function() {
    var curObject = this;
    var board = curObject.board[0];
    //Make sure board is object
    setInterval(function(){
        if(paused == false) {
            var generatedType = curObject[Math.floor(Math.random()*curObject.length)];
            if(timer%2 == 0) {
                generateRandPair(generatedType);
            }
            timer++;
        }
    }, 1000);
};

Game.prototype.lossCheck = function() {
    
};

Game.prototype.run = function(width, height, canvas) {
    console.log(canvas);
    var curObject = this;
    curObject.board.push(new Board(width, height));
    curObject.board[0].setCells();
    //Could make canvas a property of Game
    if (canvas && typeof canvas == "object") {
        canvas.drawBoard();
    }

    // curObject.startTimer();
};



// module.exports = Game;

function Board(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.selectedCells = [];
    this.full = false;
};

//makeCell function

Board.prototype.makeActive = function(cell, newType) {
    //Replace Cell in board.cells
    var temp = this.cells[cell.y][cell.x];
    this.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
    this.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
    //Set PF
    // grid.setWalkableAt(cell.x, cell.y, false);
    // grid.setWalkableAt(cell.x, cell.y, false);
}, 

Board.prototype.makeEmpty = function(cell) {
    var temp = this.cells[cell.y][cell.x];
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    // grid.setWalkableAt(cell.x, cell.y, true);
    // grid.setWalkableAt(cell.x, cell.y, true);
};

Board.prototype.makeBlock = function(cell) {
    var temp = this.cells[cell.y][cell.x];
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    // grid.setWalkableAt(cell.x, cell.y, true);
    // grid.setWalkableAt(cell.x, cell.y, true);
};

Board.prototype.getCell = function(x, y) {
    var curObject = this;
    for (var i = 0; i < curObject.cells.length; i++) {
        for (var j = 0; j < curObject.cells[i].length; j++) {
            if (curObject.cells[i][j].x == x && curObject.cells[i][j].y == y) {
                return curObject.cells[i][j];
            }
        }
    }
};

Board.prototype.setCells = function() {
    var curObject = this;
    curObject.cells = [];
    for(var i = 0; i < curObject.height; i++) {
        var rowArray = [];
        var newy = i;
        for(var j = 0; j < curObject.width; j++) {
            var newx = j;
            var newCell = new Cell(newx, newy);
            rowArray.push(newCell);
        }
        curObject.cells.push(rowArray);
    }
};

//Checks for loss then replaces two empty Cells within board with ActiveCells
Board.prototype.generateRandPair = function(type) {
    var curObject = this;
    if(curObject.lossCheck()) {
        //end game
    }
    var emptyCells = [];
    for(var i = 0; i < curObject.height; i++) {
        for(var j = 0; j < curObject.width; j++) {
            if(curObject.cells[i][j].type == "empty") {
                emptyCells.push(curObject.cells[i][j]);
            }
        }
    }
    var random1 = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    var random2 = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    if(type != "block") {
        curObject.makeActive(random1, type);
        curObject.makeActive(random2, type);
    }
    else {
        curObject.makeBlock(random1);
        curObject.makeBlock(random2);
        debugger;
    }
};

Board.prototype.lossCheck = function() {
    var curObject = this;
    var takenCells = [];
    for(var i = 0; i < curObject.width; i++) {
        for(var j = 0; j < curObject.height; j++) {
            if(curObject.cells[i][j].status == 1 || curObject.cells[i][j].status == 2) {
                takenCells.push(curObject.cells[i][j]);
            }
        }
    }
    if(takenCells.length == curObject.cells.length) {
        //End game
        curObject.full = true;
        return true;
    }
    return false;
};

//Cell constructor
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.type = "empty";
    this.status = 0;
    this.selected = false;
}

// Cell.prototype.makeWalkable = function() {
//     //Get grid object
//     grid.setWalkableAt(this.x, this.y, false);
//     grid.setWalkableAt(this.x, this.y, false);
// };

//Active cell 
function ActiveCell(x, y, type) {
    Cell.apply(this, arguments);    
    this.type = type;
    this.status = 1;
}
ActiveCell.prototype = new Cell();
ActiveCell.prototype.constructor = ActiveCell;

//Blocked cell constructor
function BlockCell(x, y) {
    Cell.apply(this, arguments)
    this.type = "block";
    this.status = 2;
}
BlockCell.prototype = new Cell();
BlockCell.prototype.constructor = BlockCell;
//TODO makeWalkable()

function mainCanvas() {
    this.canvas = document.getElementById('main');
    this.game = new Game();
    this.fps = 30;
}

mainCanvas.prototype.drawBoard = function() {
    var curObject = this;
    if(curObject.canvas.getContext('2d')) {
        var ctx = curObject.canvas.getContext('2d');

        //draw square for each cell
        for (var i = 0; i < curObject.game.board[0].cells.length; i++) {
            for (var j = 0; j < curObject.game.board[0].cells[i].length; j++){
                var startX = curObject.game.board[0].cells[i][j].x * 30;
                var startY = curObject.game.board[0].cells[i][j].y * 30;
                if(curObject.game.board[0].cells[i][j].status != 0) {
                    //if square isn't empty, draw
                    ctx.fillStyle = "red";
                    ctx.fillRect(startX, startY, (.1 * ctx.height), 60);
                }
                else if (curObject.game.board[0].cells[i][j].status == 0) {
                    console.log(startX + ", " + startY);
                    ctx.fillStyle = "#f4f5f4";
                    ctx.fillRect(startX, startY, 30, 30);
                    ctx.strokeStyle = "#aaa";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(startX, startY, 30, 30);
                }
            }
        }
    }
};

// mainCanvas.prototype.startGame = function(width, height) {
//     var curObject = this;
//     curObject.game.run(6, 6);
//     // setInterval(function(){
//     //     var ctx = curObject.canvas.getContext('2d');
//     //     // ctx.clearRect(0, 0, 400, 400);
//     //     curObject.drawBoard();
//     // }, 1000 / curObject.fps);
//     curObject.drawBoard();
// };