
//Enum for gamestate
var gameStateEnum = {
    "PLAYING" : 1,
    "X_WON" : 2,
    "O_WON" : 3,
    "TIED" : 4
}

var pieceEnum = {
    "X_PIECE" : 'X',
    "O_PIECE" : 'O',
    "EMPTY_CELL" : ' '
}

/*
    None of the code inside the board must not be touched directly by the client. Only the game has access to this object.
    The coordinate system of the board is (depthCoordinate, verticalCoordinate, horizontalCoordinate).
    The board has no concept of 'X' and 'O', it only actually knows an empty cell.
*/
function Board(size){
    console.log("board about to be made");
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

    console.log("board initialized");

    /*
        Adds new character into the board.
        Does not care what kind of piece is being inserted.
        Takes in the coordinates and the piece being inserted.
    */
    this.addNewCharacter = function(row, col, height, piece){
        console.log("new character(" + piece + ") added at (" + row + ", " + col + ", " + height + ")");
        boardArray[row][col][height] = piece;
    }

    /*
        Sees if the location that is asking to be placed in is still within the boards boundaries.
        Takes in the coordinates of the board.
    */
    this.isLocationValid = function(row, col, height){
        console.log("isLocationValid called");
        return  (row >= 0 && row < BOARD_SIZE) &&
                (col >= 0 && col < BOARD_SIZE) &&
                (height >= 0 && height < BOARD_SIZE);
    }

    /*
        Sees if the location that is asking to be placed already has something inside it.
        Takes in the coordinates of the board.
    */
    this.isLocationFilled = function(row, col, height){
        console.log("isLocationFilled called");
        return boardArray[row][col][height] !== EMPTY_CELL;
    }

    /*
        Sees if the board is full.
    */
    this.isBoardFull = function(){
        console.log("isBoardFullCalled");
        for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
            for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
                for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                    if(boardArray[vertIndex][horizIndex][depthIndex] === EMPTY_CELL){
                        console.log("board is NOT full");
                        return false;
                    }
                }
            }
        }
        console.log("board is full");
        return true;
    }

    /*
        Gets how many moves aka pieces have been placed into the board.
    */
    this.getMoveAmount = function(){
        console.log("getMoveAmount called");
        var pieceAmount = 0;
        for(var depthIndex = 0; depthIndex < BOARD_SIZE; depthIndex++){
            for(var horizIndex = 0; horizIndex < BOARD_SIZE; horizIndex++){
                for(var vertIndex = 0; vertIndex < BOARD_SIZE; vertIndex++){
                    if(boardArray[vertIndex][horizIndex][depthIndex] !== EMPTY_CELL){
                        pieceAmount++;
                    }
                }
            }
        }
        console.log("there are " + pieceAmount + " pieces/moves on the board");
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

        while(  (curHeight >= 0 && curHeight < BOARD_SIZE) &&
                (curRow >= 0 && curRow < BOARD_SIZE) &&
                (curCol >= 0 && curCol < BOARD_SIZE)){
            if(boardArray[curHeight][curRow][curCol] !== piece){
                return false;
            }
            curHeight += depthDirection;
            curRow += vertDirection;
            curCol += horizDirection;
        }
        return true;
    }

    /*
        checks if the piece in question has won or not.
    */
    this.hasPieceWon = function(piece){
        console.log("hasPieceWon called.. checking if " + piece + " won");

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
        console.log(piece + " did NOT win");
        return false;
    }

    //TODO: does the x piece and o piece need an enum
    /*
        Checks if game has finished. Returns the state of the game.
    */
    this.hasGameFinished = function(player1, player2){
        console.log("hasGameFinished called");
        if(this.hasPieceWon(player1)){
            console.log("x won");
            return gameStateEnum.X_WON;
        }
        else if(this.hasPieceWon('player2')){
            console.log("o won");
            return gameStateEnum.O_WON;
        }
        else if(this.isBoardFull()){
            console.log("there was a tie");
            return gameStateEnum.TIED;
        }
        console.log("nobody won and there is no tie, so we are still playing");
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

function Game(){
    console.log("about to make a game");
    var BOARD_SIZE = 4;
    var X_PIECE = 'X';
    var O_PIECE = 'O';
    var currentGameState = gameStateEnum.PLAYING;
    var board = new Board(BOARD_SIZE);
    var expectedChar = X_PIECE;
    console.log("initialized a game");
    //TODO: do i need to know who the players are as in the names?

    //the game has 4 boards.

    /*
        Returns the size of the board.
    */
    this.getBoardSize = function(){
        return BOARD_SIZE;
    }

    /*
        Returns the expected character of the game.
    */
    this.getExpectedChar = function(){
        return expectedChar;
    }

    /*
        Updates the expected character.
        CLIENT MUST NOT TOUCH THIS.
    */
    this.updateExpectedChar = function(){
        console.log("updateExpectedChar called");
        if(expectedChar === X_PIECE){
            expectedChar = O_PIECE;
        }
        else{
            expectedChar = X_PIECE;
        }
        console.log("updated expected char.. it is now " + expectedChar);
    }

    /*
        Does end game functions.
    */
    this.gameEnded = function(state){
        console.log("gameEnded called");
        //TODO: use socketio or something so that we can determine whos turn is it? but how can we have many games while this is happening? hm
        //TODO: maybe return a json? or maybe this is what will talk to the server?
    }


    //TODO: public, use this when a cell gets clicked
    //TODO: how do we know whos turn is it? will the server let us know?
    /*
        This is what happens to update the game and let it do its thing.
        Accepts the coordinates and the piece that one tries to place into the board.
    */
    this.boardClicked = function(row, col, height, piece){
        console.log("boardClicked called");
        if(!board.isLocationFilled(row, col, height)){
            console.log("specified location not filled");
            if(piece === expectedChar){
                console.log("the piece is the expected char")
                board.addNewCharacter(row, col, height, piece);
                console.log("finished adding the new character into the board");
                if(board.hasGameFinished(X_PIECE, O_PIECE) === gameStateEnum.X_WON){
                    console.log("the game has finished with x winning.. game about to end");
                    alert("x won!");
                    return this.gameEnded();
                }
                else if(board.hasGameFinished(X_PIECE, O_PIECE) === gameStateEnum.O_WON){
                    console.log("the game has finished with o winning.. game about to end");
                    alert("o won!");
                    return this.gameEnded();

                }
                else if(board.hasGameFinished(X_PIECE, O_PIECE) === gameStateEnum.TIED){
                    console.log("the game has finished with nobody winning.. game about to end");
                    alert("nobody won!");
                    return this.gameEnded();
                }
                else{
                    console.log("the game has not yet finished.. game will continue");
                    this.updateExpectedChar();
                }
                return;
            }
            console.log("Error: piece was NOT the expectedChar.. not doing anything");
            return;
        }
        console.log("Error: the location where it was clicked is already filled.. not doing anything");
    }

    /*
        Gets the board object. Only used for debugging.
    */
    this.getBoard = function(){
        return board;
    }
}

var game = new Game();

var dynamicHTML = "";
var size = game.getBoardSize();

//Initialize tables
for(var i = 0; i < size; i++){
    dynamicHTML += "<table><tbody>";
    for(var j = 0; j < size; j++){
        dynamicHTML += "<tr>";
        for(var k = 0; k < size; k++){
            dynamicHTML += "<td id='cell" + i + j + k + "' onclick='cellClicked(" + i + "," + j + "," + k + ")'></td>";
        }
        dynamicHTML += "</tr>"
    }
    dynamicHTML += "</tbody></table><br>";
}
dynamicHTML += "<button onclick='quitButtonClicked()'>QUIT GAME</button>";

document.getElementById('tableTest').innerHTML += dynamicHTML;

//TODO: this function is no longer needed
function clickedButton(depthCoord, vertCoord, horizCoord, piece){
    console.log("button clicked");
    game.boardClicked(depthCoord, vertCoord, horizCoord, piece);
    game.getBoard().printState();
}

function cellClicked(depth, row, col){
    console.log("cellClicked!");
//    document.getElementById('cell' + depth + row + col).innerHTML = game.getExpectedChar();
    document.getElementById('cell' + depth + row + col).style.backgroundColor = game.getExpectedChar() === 'X' ? "blue" : "green";
    game.boardClicked(depth, row, col, game.getExpectedChar());
}

function quitButtonClicked(){
    alert("someone quit!");
    game.gameEnded(gameStateEnum.X_WON);//TODO: change later
}