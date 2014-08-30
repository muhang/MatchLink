//requires game.js

function mainCanvas(gameType) {
    this.canvas = document.getElementById('canvas');
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
                var startX = curObject.game.board.cells[i][j].x * 40;
                var startY = curObject.game.board.cells[i][j].y * 40;
                if(curObject.game.board.cells[i][j].status != 0) {
                    //if square isn't empty, draw
                    ctx.fillStyle = "red";
                    ctx.fillRect(startX, startY, 40, 40);
                }
            }
        }
    }
};

mainCanvas.prototype.update = function() {
    var curObject = this;

};

mainCanvas.prototype.startGame = function(width, height) {
    var curObject = this;
    curObject.game.run(6, 6);
    setInterval(function(){
        curObject.canvas.clearRect(0, 0, 400, 400);
        curObject.update():
        curObject.drawBoard();
    }, 1000 / curObject.fps);
};



//main loop: timeout w/ framerate and draw