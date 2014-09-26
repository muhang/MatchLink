//All patherfinder.js related code disabled

//GAME

function Game() {
    this.timer = 0;
    this.isActive = false;
    this.timePlayed = 0;
    this.pause = false;
    this.board = [];
}

Game.prototype.lossCheck = function() {

};

Game.prototype.run = function(width, height, canvas) {
    var curObject = this;
    curObject.board.push(new Board(width, height));
    curObject.board[0].setGrid();
    console.log(curObject.board[0].grid);
    curObject.board[0].setCells();

    //timer
    setInterval(function(){
        if (curObject.pause === false) {
            if (curObject.timer%2 === 0) {
                curObject.board[0].generateRandCell();
            }
            curObject.timer++;
        }
    }, 1000);
    if (canvas && typeof canvas == "object") {
        //canvas handlers
        //Event handlers
        canvas.gameEvent();
        //60 fps refresh
        setInterval(function(){
            var ctx = canvas.canvas.getContext('2d');
            var canHeight = document.getElementById('game-wrapper').offsetHeight;
            ctx.clearRect(0, 0, canHeight, canHeight);
            canvas.drawBoard();
        }, 1000 / 60);
    }

};

//BOARD

function Board(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.selectedCells = [];
    this.full = false;
    this.grid = undefined;
    this.activeTypes = [1, 2, 3, 4, 5, 6, 7, "block"];
}

//makeCell functions

Board.prototype.makeActive = function(cell, newType) {
    var curObject = this;
    //Replace Cell in board.cells
    var temp = curObject.cells[cell.y][cell.x];
    curObject.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
    curObject.cells[cell.y][cell.x] = new ActiveCell(temp.x, temp.y, newType);
    //Set PF
    curObject.grid.setWalkableAt(cell.x, cell.y, false);
    curObject.grid.setWalkableAt(cell.x, cell.y, false);
};

Board.prototype.makeEmpty = function(cell) {
    var temp = this.cells[cell.y][cell.x];
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    curObject.grid.setWalkableAt(cell.x, cell.y, true);
    curObject.grid.setWalkableAt(cell.x, cell.y, true);
};

Board.prototype.makeBlock = function(cell) {
    var temp = this.cells[cell.y][cell.x];
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    this.cells[cell.y][cell.x] = new Cell(temp.x, temp.y);
    curObject.grid.setWalkableAt(cell.x, cell.y, true);
    curObject.grid.setWalkableAt(cell.x, cell.y, true);
};

Board.prototype.removeSelection = function() {
    var curObject = this;
    if (curObject.selectedCells.length) {
        for (var i = 0; i < curObject.selectedCells.length; i++) {
            curObject.selectedCells[i].selected = false;
        }
        curObject.selectedCells = [];
    }
};

//Get cell from board
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

//Set board for play with all empty cells
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

Board.prototype.setGrid = function() {
    var curObject = this;
    var matrix = [];
    for (var i = 0; i < curObject.width; i++) {
        var matRow = [];
        for (var j = 0; j < curObject.height; j++) {
            matRow.push(0);
        }
        matrix.push(matRow);
    }
    curObject.grid = new PF.Grid(curObject.width, curObject.height, matrix);
};

//Checks for loss then replaces two empty Cells within board with ActiveCells
Board.prototype.generateRandCell = function() {
    var curObject = this;
    var randType = curObject.activeTypes[Math.floor(Math.random()*curObject.activeTypes.length)];
    // if(curObject.lossCheck()) {
    //     //end game
    // }
    var emptyCells = [];
    for(var i = 0; i < curObject.height; i++) {
        for(var j = 0; j < curObject.width; j++) {
            if(curObject.cells[i][j].type == "empty") {
                emptyCells.push(curObject.cells[i][j]);
            }
        }
    }
    var random = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    // var random2 = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    if(randType != "block") {
        curObject.makeActive(random, randType);
        curObject.makeActive(random, randType);
    }
    else {
        curObject.makeBlock(random);
        curObject.makeBlock(random);
    }
};

//Simple match of ActiveCells
Board.prototype.typeMatch = function(cell1, cell2) {
    if(cell1.status == 1 && cell2.status == 1 && cell1.type == cell2.type) {
        return true;
    }
    return false;
};

//Checks for path between matching cells
Board.prototype.getPath = function(cell1, cell2) {
    curObject = this;
    //PathfindingJS stuff
    curObject.grid.setWalkableAt(cell1.x, cell1.y, true);
    curObject.grid.setWalkableAt(cell2.x, cell2.y, true);
    var gridBackup = curObject.grid.clone();
    var finder = new PF.AStarFinder();
    var path = finder.findPath(cell1.x, cell1.y, cell2.x, cell2.y, curObject.grid);
    curObject.grid = gridBackup;

    //Diagonals throw exception
    try{
        var checkTurns = PF.Util.smoothenPath(curObject.grid, path);
    }
    catch(err){
        path = [];
        return false;       //Failure
    }

    if(path.length) {
        for(var i = 0; i < path.length; i++) {
            var boardCell = curObject.getCell(path[i][0], path[i][1]);
            boardCell.inPath = true;
            boardCell.pathNumber = i + 1;
            //animate cell
            // boardCell.inPath = false;
        }
        return true;
    }
    return true;
};

//If match & path, clear cells and play animation
Board.prototype.matchCells = function(cell1, cell2) {
    curObject = this;
    if (curObject.typeMatch(cell1, cell2))  {
        if (curObject.getPath(cell1, cell2)) {
            return true;
        }
        return false;
    }
    return false;
};

//CELL

//Cell constructor
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.type = "empty";
    this.status = 0;
    this.selected = false;
    this.inPath = false;
    this.pathNumber = 0;
}

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
    Cell.apply(this, arguments);
    this.type = "block";
    this.status = 2;
}
BlockCell.prototype = new Cell();
BlockCell.prototype.constructor = BlockCell;

//CANVAS

function mainCanvas(sizeCallback) {
    this.canvas = document.getElementById('main');
    this.game = new Game();
    this.fps = 30;
    if (sizeCallback && typeof sizeCallback == "function") {
        sizeCallback(this.canvas);
    }
}

mainCanvas.prototype.gameEvent = function() {
    var curObject = this;

    //
    curObject.canvas.addEventListener('click', function(event) {
        event.preventDefault();
        var x = event.pageX - document.getElementById('game-wrapper').offsetLeft;
        var y = event.pageY - document.getElementById('game-wrapper').offsetTop;
        var cellX = Math.floor(x / (document.getElementById('game-wrapper').offsetWidth / 6));
        var cellY = Math.floor(y / (document.getElementById('game-wrapper').offsetHeight / 6));
        var evBoard = curObject.game.board[0]
        var selectedCell = evBoard.getCell(cellX, cellY);
        if (selectedCell.type != "empty" && selectedCell.type != "block") {
            selectedCell.selected = true;
            evBoard.selectedCells.push(selectedCell);
            if (evBoard.selectedCells.length == 2 && evBoard.selectedCells[0] != evBoard.selectedCells[1]) {
                if (evBoard.matchCells(evBoard.selectedCells[0], evBoard.selectedCells[1])) {
                    var pathCells = [];
                    evBoard.makeEmpty(evBoard.selectedCells[0]);
                    evBoard.makeEmpty(evBoard.selectedCells[1]);
                    evBoard.removeSelection();
                    //animation, set inPath to false
                    for (var i = 0; i < evBoard.cells.length; i++) {
                        if (evBoard.cells[i].pathNumber != 0) {
                            pathCells.push(evBoard.cells[i]);
                        }
                    }
                    pathCells = pathCells.sort(
                        function(a, b) {
                            return a - b;
                        });
                    for (var i = 0; i < pathCells.length; i++) {
                        (function(i){
                            setTimeout(function(){
                                console.log(pathCells[i] + "leaving path");
                                pathCells[i].inPath = false;
                            }, 400);
                        }(i));
                    }
                }
                evBoard.removeSelection();
            }
            else if (evBoard.selectedCells[0] == evBoard.selectedCells[1]) {
                evBoard.removeSelection();
            }

        }
    }, false);
};

mainCanvas.prototype.typeColor = function(cell) {
    var typeHex = "";
    if(typeof cell.type == "number" && cell.inPath === false) {
        switch(cell.type) {
            //red
            case 1:
                typeHex = "#e51c23";
                break;

            //blue
            case 2:
                typeHex = "#5677fc";
                break;

            //green
            case 3:
                typeHex = "#259b24";
                break;

            //yellow
            case 4:
                typeHex = "#ffeb3b";
                break;

            //orange
            case 5:
                typeHex = "#ff9800";
                break;

            //purple
            case 6:
                typeHex = "#9c27b0";
                break;

            //brown
            case 7:
                typeHex = "#795548";
                break;
        }
        return typeHex;
    }
    else {
        if (typeof cell.type == "string" && cell.inPath === false) {
            switch(cell.type) {
                case "block":
                    typeHex = "#212121";
                    break;
            }
            return typeHex;
        }
        else if (cell.inPath === true) {
            typeHex = "#000";
        }
    } 
};

mainCanvas.prototype.typeStroke = function(cell) {
    if (typeof cell.selected == "boolean") {
        if (cell.selected === true) {

            return "#14e715";
        }
        return "#212121";
    }
};

mainCanvas.prototype.drawBoard = function() {
    var curObject = this;
    if(curObject.canvas.getContext('2d')) {
        var ctx = curObject.canvas.getContext('2d');

        //draw square for each cell
        var cellSize = document.getElementById('game-wrapper').offsetHeight / 6;
        for (var i = 0; i < curObject.game.board[0].cells.length; i++) {
            for (var j = 0; j < curObject.game.board[0].cells[i].length; j++){
                var startX = curObject.game.board[0].cells[i][j].x * cellSize;
                var startY = curObject.game.board[0].cells[i][j].y * cellSize;
                if(curObject.game.board[0].cells[i][j].status !== 0) {
                    //if square isn't empty, draw
                    //get hex color from typeColor
                    if (curObject.game.board[0].cells[i][j].selected === true) {
                        ctx.fillStyle = "#14e715";
                    } else {
                        ctx.fillStyle = curObject.typeColor(curObject.game.board[0].cells[i][j]);
                    }
                    ctx.strokeStyle = curObject.typeStroke(curObject.game.board[0].cells[i][j]);
                    ctx.lineWidth = 1;
                    ctx.strokeRect(startX, startY, cellSize, cellSize);
                    ctx.fillRect(startX, startY, cellSize, cellSize);
                }
                else if (curObject.game.board[0].cells[i][j].status === 0) {
                    ctx.fillStyle = "#f4f5f4";
                    ctx.fillRect(startX, startY, cellSize, cellSize);
                    ctx.strokeStyle = "#aaa";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(startX, startY, cellSize, cellSize);
                }
            }
        }
    }
};

