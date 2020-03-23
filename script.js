var TTT = function () 
{
    this.PLAYER_X = 0;
    this.PLAYER_O = 1;
    this.round = 0;
    this.turn = 0;
    this.playerX = [];
    this.playerO = [];
    this.moves = [];
    this.scores = [0, 0];
    this.win = [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], 
                 [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];}

TTT.prototype.makeMove = function(position)
{
    var el = document.getElementById(position);
    position = parseInt(position.slice(-1));
    if (this.turn===this.PLAYER_O && this.isValidMove(position))
        this.makeMoveAux(el, position, this.playerO, this.PLAYER_O, "O");
    else if (this.turn===this.PLAYER_X && this.isValidMove(position))
        this.makeMoveAux(el, position, this.playerX, this.PLAYER_X, "X");
}

TTT.prototype.makeMoveAux = function(el, pos, playerMoves, player, symbol)
{
    el.innerHTML = symbol;
    playerMoves.push(pos);
    this.moves.push(pos);
    $(".bottom-text").text(this.turn ? "X turn" : "O turn");
    this.isWin(playerMoves, player, symbol);
    this.turn = (player+1)%2;
}

TTT.prototype.isValidMove = function(position)
{
    if (!this.moves.find(element => element === position)) return true;
    return false;
}

TTT.prototype.isWin = function(playerMoves, player, symbol) 
{
    this.win.forEach(arr => {
        if (arr.every(el => playerMoves.includes(el))) {
            this.updateScores(player, symbol);
            this.round++;
            // stop moves
            this.moves = Array.from(Array(10).keys());
            // paint winner
            arr.forEach(col => {
                $("#col-".concat(col)).css({"background-color":"#ffd000", "color":"black"});
            });
            $(".top-text").text(symbol.concat(" wins!")).show();
            $(".bottom-text").text("Restart Game");
        }   
    });
    // tie
    if (this.moves.length===9) {
        this.round++;
        $(".top-text").text("It's a tie").show();
        $(".bottom-text").text("Restart Game");
    }
}

TTT.prototype.restartGame = function()
{
    this.turn = (this.round)%2;
    this.playerX = [];
    this.playerO = [];
    this.moves = [];
    for (let i = 1; i < 10; i++) {
        $("#col-".concat(i)).css({"background-color":"black", "color":"#ffd000"});
    }
}

TTT.prototype.updateScores = function(player, symbol)
{
    this.scores[player]++;
    $('div[id*="player-'.concat(symbol, '"] .score')).text(this.scores[player]);
}


var Game = new TTT();

$(document).ready(function(){
    $(".start-button").click(function() {
        $(".game-init").hide();
        $(".container").css({"background-image":"url('assets/images/game.png')", "flex-direction":"row"});
        $(".top-text").show();
        $(".board").show();
        $(".bottom-text").show();
        $(".player").css({"display":"flex", "flex-direction":"column"}).show();
    });
    $(".bottom-text").click(function() {
        $('div[id*="col-"]').text("");
        Game.restartGame();
        $(".top-text").text("Round ".concat(Game.round+1));
        $(".bottom-text").text(Game.turn ? "O turn" : "X turn");
    });
    $('div[id*="col-"]').click(function() {
        Game.makeMove($(this).attr("id"));
    });
}); 
