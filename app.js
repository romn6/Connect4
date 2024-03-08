document.addEventListener("DOMContentLoaded", function(){
// Initialize variables
var playerRed = "R";
var playerYellow= "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;
var currColumns;

var row = 6;
var columns = 7;

window.onload = function(){
    setGame();
    makePiecesDraggable();
}
// Function to set up the game
function setGame(){
    
    document.getElementById("board").innerHTML = '';

    board = [];
    currColumns =[5, 5, 5, 5, 5, 5, 5,];


for(let r = 0; r < row; r++){
    let row = [];
    for(let c = 0; c < columns; c++){
        row.push(' '); 
        let tile = document.createElement("div"); 
        tile.id = r.toString() + "-" + c.toString();
        tile.classList.add("tile");
        tile.addEventListener("click", setPiece);
        document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}
// Function to handle setting a game piece
function setPiece() {
    if(gameOver){
        return;
    }

    let coords = this.id.split("-"); 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if(r < 0){
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if(currPlayer == playerRed){
        tile.classList.add("blue-piece");
        currPlayer = playerYellow;
    } 
    else {
        tile.classList.add("red-piece");
        currPlayer = playerRed;
    }

    r -= 1; 
    currColumns[c] = r;

    checkWinner();

}
    // Function to check for a winner
        function checkWinner() {
             
            for(let r = 0; r < row; r++) {
                for(let c = 0; c < columns - 3; c++) {
                    if(board[r][c] !== ' ') {
                        if(board[r][c] === board[r][c+1] && 
                           board[r][c+1] === board[r][c+2] && 
                           board[r][c+2] === board[r][c+3]) {
                            setWinner(r, c);
                            return;
                        }
                    }
                }
            }
            
            
            for(let c = 0; c < columns; c++) {
                for(let r = 0; r < row - 3; r++) {
                    if(board[r][c] !== ' ') {
                        if(board[r][c] === board[r+1][c] && 
                           board[r+1][c] === board[r+2][c] && 
                           board[r+2][c] === board[r+3][c]) {
                            setWinner(r, c);
                            return;
                        }
                    }
                }
            }
        
            
            for(let r = 0; r < row - 3; r++) {
                for(let c = 0; c < columns - 3; c++) {
                    if(board[r][c] !== ' ') {
                        if(board[r][c] === board[r+1][c+1] && 
                           board[r+1][c+1] === board[r+2][c+2] && 
                           board[r+2][c+2] === board[r+3][c+3]) {
                            setWinner(r, c);
                            return;
                        }
                    }
                }
            }
        
            
            for(let r = 3; r < row; r++) {
                for(let c = 0; c < columns - 3; c++) {
                    if(board[r][c] !== ' ') {
                        if(board[r][c] === board[r-1][c+1] &&  
                           board[r-1][c+1] === board[r-2][c+2] && 
                           board[r-2][c+2] === board[r-3][c+3]) {
                            setWinner(r, c);
                            return;
                        }
                    }
                }
            }
        }
    
// Function to handle setting the winner of the game.
    function setWinner(r, c){
        let winner = document.getElementById("winner");
        if(board[r][c] == playerRed){
            winner.innerText = "Red Wins";
            winner.style.color = "#E34234"; 
            winner.style.fontWeight = "Roboto, sans-serif";
            winner.style.marginLeft = "1050px"
        } else {
            winner.innerText = "Blue Wins";
            winner.style.color = "#00FFFF"; 
            winner.style.fontWeight = "Roboto, sans-serif";
            winner.style.marginLeft = "1050px"
        }
        gameOver = true;

        setTimeout(resetGame, 3000);
    }
    // Function to handle game reset
    function resetGame() {
        currPlayer = playerRed;
        gameOver = false;
        document.getElementById("winner").innerText = "";
        setGame();
        makePiecesDraggable();
        
    }
    // Function to make game pieces draggable
    function makePiecesDraggable() {
        const redChip = document.getElementById("redChip");
        const blueChip = document.getElementById("blueChip");
    
        redChip.addEventListener("dragstart", handleDragStart);
        blueChip.addEventListener("dragstart", handleDragStart);
    
        const columns = document.querySelectorAll("#board > div");
        columns.forEach((column) => {
            column.addEventListener("dragover", handleDragOver);
            column.addEventListener("drop", handleDrop);
        });
    }
    
    function handleDragStart(event) {
        event.dataTransfer.setData("pieceId", event.target.id);
    }
    
    function handleDragOver(event) {
        event.preventDefault();
    }
    //Function to handle the dropping of a game piece into a column.
    function handleDrop(event) {
        event.preventDefault();
        const pieceId = event.dataTransfer.getData("pieceId");
        const draggedPiece = document.getElementById(pieceId);
        const col = parseInt(event.target.id.split("-")[1]);
        const row = findLowestEmptySpot(col);
        if (row === -1) return;
        board[row][col] = currPlayer;
        updateBoard();
        dropAnimation(row, col, currPlayer);
        checkWinner();
        currPlayer = currPlayer === playerRed ? playerYellow: playerRed;
    }
    //Function to update the game board with the current state of the game.
    function updateBoard() {
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < columns; c++) {
                const cell = document.getElementById(r.toString() + "-" + c.toString());
                cell.className = "tile";
                if (board[r][c] === playerRed) {
                    cell.classList.add("red-piece");
                } else if (board[r][c] === playerYellow) {
                    cell.classList.add("blue-piece");
                }
            }
        }
    }
    //Function to animate the dropping of a game piece into the board.
    function dropAnimation(row, col, player) {
        const cellId = row.toString() + "-" + col.toString();
        const cell = document.getElementById(cellId);
        const piece = document.createElement("div");
        piece.className = player === playerRed ? "red-chip" : "blue-chip";
        cell.appendChild(piece);
    }
    //Function to find the lowest empty spot in a column for dropping a game piece
    function findLowestEmptySpot(col) {
        for (let r = row - 1; r >= 0; r--) {
            if (board[r][col] === ' ') {
                return r;
            }
        }
        return -1; 
    }
    // Event listener for when the DOM content is loaded
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetGame);
});
