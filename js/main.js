var gameCanvas = new mainCanvas(function(canvas){
    var wrapperWidth = document.getElementById('game-wrapper').offsetHeight;
    var wrapperHeight = document.getElementById('game-wrapper').offsetWidth;

    canvas.setAttribute("width", wrapperWidth + "px");
    canvas.setAttribute("height", wrapperHeight + "px");
    
});
gameCanvas.game.run(6, 6, gameCanvas);
