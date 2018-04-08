var isMyTurn = false;
//Enum for gamestate
var gameStateEnum = {
    "PLAYING" : 1,
    "X_WON" : 2,
    "O_WON" : 3,
    "TIED" : 4
}

/*
    None of the code inside the board must not be touched directly by the client. Only the game has access to this object.
    The coordinate system of the board is (depthCoordinate, verticalCoordinate, horizontalCoordinate).
    The board has no concept of 'X' and 'O', it only actually knows an empty cell.
*/
function Board(size){
    var BOARD_SIZE = size;
    var EMPTY_CELL = '~';
    var boardArray = [];

    //Initialize board to be empty
    for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
        var horizArray = [];

        for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
            var vertArray = [];

            for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                vertArray.push(EMPTY_CELL);
            }
            horizArray.push(vertArray);
        }
        boardArray.push(horizArray);
    }

    /*
        Adds new character into the board.
        Does not care what kind of piece is being inserted.
        Takes in the coordinates and the piece being inserted.
    */
    this.addNewCharacter = function(height, row, col, piece){
        boardArray[height][row][col] = piece;
    }

    /*
        Sees if the location that is asking to be placed in is still within the boards boundaries.
        Takes in the coordinates of the board.
    */
    this.isLocationValid = function(height, row, col){
        return  (row >= 0 && row < BOARD_SIZE) &&
                (col >= 0 && col < BOARD_SIZE) &&
                (height >= 0 && height < BOARD_SIZE);
    }

    /*
        Sees if the location that is asking to be placed already has something inside it.
        Takes in the coordinates of the board.
    */
    this.isLocationFilled = function(height, row, col){
        return boardArray[height][row][col] !== EMPTY_CELL;
    }

    /*
        Sees if the board is full.
    */
    this.isBoardFull = function(){
        for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
            for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
                for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                    if(boardArray[depthIndex][vertIndex][horizIndex] === EMPTY_CELL){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /*
        Gets how many moves aka pieces have been placed into the board.
    */
    this.getMoveAmount = function(){
        var pieceAmount = 0;
        for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
            for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
                for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                    if(boardArray[depthIndex][vertIndex][horizIndex] !== EMPTY_CELL){
                        pieceAmount++;
                    }
                }
            }
        }
        return pieceAmount;
    }

    /*
        Checks if the initial coordinate with the specified direction is continuous with the given piece.
        Takes in the coordinates to base its continuity.
        Takes the direction for where to search.
        Takes the piece for which to check if it is continuous with the given vectors.
    */
    this.isContinuous = function(   depthCoord,     vertCoord,      horizCoord,
                                    depthDirection, vertDirection,  horizDirection,
                                    piece){
        var curHeight = depthCoord;
        var curRow = vertCoord;
        var curCol = horizCoord;
        var coordinateString = "(" + depthCoord + ", " + vertCoord + ", " + horizCoord + "), ";

        while(  (curHeight >= 0 && curHeight < BOARD_SIZE) &&
                (curRow >= 0 && curRow < BOARD_SIZE) &&
                (curCol >= 0 && curCol < BOARD_SIZE)){
            if(boardArray[curHeight][curRow][curCol] !== piece){
                return false;
            }
            curHeight += depthDirection;
            curRow += vertDirection;
            curCol += horizDirection;
            coordinateString += "(" + curHeight + ", " + curRow + ", " + curCol + "), ";
        }
        return true;
    }

    /*
        checks if the piece in question has won or not.
    */
    this.hasPieceWon = function(piece){

        //go through each depth index
        for(var currentDepth = 0; currentDepth < BOARD_SIZE; currentDepth++){
            for(var curIteration = 0; curIteration < BOARD_SIZE; curIteration++){
                //horizontal direction
                if(this.isContinuous(currentDepth, curIteration, 0, 0, 0, 1, piece)){
                    return true;
                }
                else if(this.isContinuous(currentDepth, 0, curIteration, 0, 1, 0, piece)){//vertical direction
                    return true;
                }
            }

            if(this.isContinuous(currentDepth, 0, 0, 0, 1, 1, piece) || this.isContinuous(currentDepth, BOARD_SIZE - 1, 0, 0, -1, 1, piece)){
                return true;
            }
        }

        //go through each row index
        for(var currentRow = 0; currentRow < BOARD_SIZE; currentRow++){
            for(var curIteration = 0; curIteration < BOARD_SIZE; curIteration++){
                //horizontal direction
                if(this.isContinuous(curIteration, currentRow, 0, 0, 0, 1, piece)){
                    return true;
                }
                else if(this.isContinuous(0, currentRow, curIteration, 1, 0, 0, piece)){//vertical direction
                    return true;
                }
            }

            //2 diagonals
            if(this.isContinuous(0, currentRow, 0, 1, 0, 1, piece) || this.isContinuous(BOARD_SIZE - 1, currentRow, 0, -1, 0, 1, piece)){
                return true;
            }
        }

        //go through each column
        for(var currentCol = 0; currentCol < BOARD_SIZE; currentCol++){
            for(var curIteration = 0; curIteration < BOARD_SIZE; curIteration++){
                //horizontal direction
                if(this.isContinuous(curIteration, 0, currentCol, 0, 1, 0, piece)){
                    return true;
                }
                else if(this.isContinuous(0, curIteration, currentCol, 1, 0, 0, piece)){//vertical direction
                    return true;
                }
            }

            //2 diagonals
            if(this.isContinuous(0, 0, currentCol, 1, 1, 0, piece) || this.isContinuous(BOARD_SIZE - 1, 0, currentCol, -1, 1, 0, piece)){
                return true;
            }
        }

        //look at the two opposite corner diagonals
        //there are 4 unique examples
        if(this.isContinuous(0, 0, 0, 1, 1, 1, piece)){//from the orgin
            return true;
        }
        else if(this.isContinuous(0, 0, BOARD_SIZE - 1, 1, 1, -1, piece)){
            return true;
        }
        else if(this.isContinuous(0, BOARD_SIZE - 1, BOARD_SIZE - 1, 1, -1, -1, piece)){
            return true;
        }
        else if(this.isContinuous(0, BOARD_SIZE - 1, 0, 1, -1, 1, piece)){
            return true;
        }
        return false;
    }

    /*
        Checks if game has finished. Returns the state of the game.
    */
    this.hasGameFinished = function(player1, player2){
        if(this.hasPieceWon(player1)){
            return gameStateEnum.X_WON;
        }
        else if(this.hasPieceWon(player2)){
            return gameStateEnum.O_WON;
        }
        else if(this.isBoardFull()){
            return gameStateEnum.TIED;
        }
        return gameStateEnum.PLAYING;
    }

    /*
        Prints the state of the board. Used for debugging.
    */
    this.printState = function(){
        var stringToLog = ""
        for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
            stringToLog += "current depth: " + depthIndex + "\n";
            for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
                    stringToLog += boardArray[depthIndex][vertIndex][horizIndex];
                    stringToLog += " ";
                }
                stringToLog += "\n";
            }
        }
        console.log(stringToLog);
    }
}

function gameFin(data){
    if(data === "redirect"){
        window.location.href = '/html/gameFinished.html';
    }
    
}
function Game(player1, player2, boardSize){
    var BOARD_SIZE = boardSize;
    var piece1 = player1;
    var piece2 = player2;
    var time = Date();

    var currentGameState = gameStateEnum.PLAYING;
    var board = new Board(BOARD_SIZE);


    //the game has 4 boards.

    /*
        Returns the size of the board.
    */
    this.getBoardSize = function(){
        return BOARD_SIZE;
    }

    this.setPlayer2 = function(piece){
        piece2 = piece;
    }

    this.setTime = function(newTime){
        time = newTime;
    }

    /*
        Does end game functions.
    */
    this.gameEnded = function(state){
        var winner = '';
        var loser = '';
        if(state === gameStateEnum.TIED){
            winner = piece2;
            loser = piece2;
        }
        else if(state === gameStateEnum.X_WON){
            winner = piece1;
            loser = piece2;
        }
        else{
            winner = piece2;
            loser = piece1;
        }
        var jsonObj = {
            "timeStarted" : time,
            "winner" : winner,
            "loser" : loser,
            "moveNumber" : board.getMoveAmount()
        }

        // //currenly works but uncommented cause handeling of post does not work on server
        $.ajax({
            method: 'POST',
            url: '/gameEndAPI',
            data: JSON.stringify(jsonObj),    
            processData: false,
            contentType: "application/json",
            success: gameFin
        });
    }

    this.sendUpdatedBoard = function(height, row, col, piece){
        var jsonObj = {
            "height":height,
            "row":row,
            "col":col,
            "piece":piece
        }
        socket.emit('sendUpdatedBoard',jsonObj);//json object willl have the coordinates and username of myself
        document.getElementById('playerTurn').innerHTML = piece === piece1 ? piece2 : piece1;
        isMyTurn = false;
    }


    /*
        This is what happens to update the game and let it do its thing.
        Accepts the coordinates and the piece that one tries to place into the board.
    */
    this.boardClicked = function(height, row, col, piece){
  
        if(!board.isLocationFilled(height, row, col)){
            document.getElementById('cell' + height + row + col).style.backgroundColor = piece === piece1 ? "blue" : "green";
            board.addNewCharacter(height, row, col, piece);
            if(board.hasGameFinished(piece1, piece2) === gameStateEnum.X_WON){
                this.gameEnded(gameStateEnum.X_WON);
                this.sendUpdatedBoard(height, row, col, piece);
                return;
            }
            else if(board.hasGameFinished(piece1, piece2) === gameStateEnum.O_WON){
                this.gameEnded(gameStateEnum.O_WON);
                this.sendUpdatedBoard(height, row, col, piece);
                return;
            }
            else if(board.hasGameFinished(piece1, piece2) === gameStateEnum.TIED){
                this.gameEnded(gameStateEnum.TIED);
                this.sendUpdatedBoard(height, row, col, piece);
                return;
            }
            else{
                this.sendUpdatedBoard(height, row, col, piece);
            }
            return;
        }
    }

    /*
        Gets the board object. Only used for debugging.
    */
    this.getBoard = function(){
        return board;
    }
}

var player1 = document.getElementById('playerOne').innerHTML;
var player2 = '';
var size = 4;
var game = new Game(player1, player2, size);

// var socket = io("http://cmpt218.csil.sfu.ca:8080");//TODO: change later to the correct thing
var socket = io("http://localhost:8080");


var dynamicHTML = "<div>";

//Initialize tables
for(var i = 0; i < size; i++){
    dynamicHTML += "<table class='tables'><tbody>";
    for(var j = 0; j < size; j++){
        dynamicHTML += "<tr>";
        for(var k = 0; k < size; k++){
            dynamicHTML += "<td id='cell" + i + j + k + "' onclick='cellClicked(" + i + "," + j + "," + k + ")'></td>";
        }
        dynamicHTML += "</tr>"
    }
    dynamicHTML += "</tbody></table>";
}
dynamicHTML += "</div><div style='clear: both;'></div><button class='quitButton' onclick='quitButtonClicked()'>QUIT GAME</button>";

document.getElementById('tableTest').insertAdjacentHTML('beforeend', dynamicHTML);

function cellClicked(depth, row, col){
    if(isMyTurn){
        game.boardClicked(depth, row, col, player1);
        game.getBoard().printState();
    }
}

function quitButtonClicked(){
    game.gameEnded(gameStateEnum.O_WON);
    socket.emit('iQuit', player1);
}

function disconnectFromSocket(){
	socket.emit('chat', `${username} has diconnected`);
	printMessage("You have diconnected");
	socket.close();
	// re-direct
}

socket.on('gameStart',function(jsonObj){
    isMyTurn = jsonObj.isMyTurn;
    for(var i = 0; i < jsonObj.usernameArray.length; i++){
        if(jsonObj.usernameArray[i] !== player1){
            player2 = jsonObj.usernameArray[i];
            game.setPlayer2(player2);
        }
    }
    document.getElementById('playerTwo').innerHTML = player2;
    document.getElementById('playerTurn').innerHTML = isMyTurn ? player1 : player2;
    game.setTime(Date());
});

socket.on('opponentBoardUpdated',function(jsonObj){
    if(jsonObj.piece !== player1){
        game.boardClicked(jsonObj.height, jsonObj.row, jsonObj.col, player2);
        isMyTurn = true;
        game.getBoard().printState();
    }
    
});

socket.on('personQuit', function (){
    game.gameEnded(gameStateEnum.X_WON);
});