// Steps: 
// 	1. Basic Setup 
// 	2. Determine Winner
// 	3. Basic AI and Winner Notification
// 	4. minimax algo

var origBoard;
//sign the players use
const humanPlayer = '0';
const aiPlayer = 'X';
//which ones win
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
// gets the cells
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    //resets the game
    document.querySelector(".endgame").style.display = "none";
    //makes the board
    origBoard = Array.from(Array(9).keys());
    for (var index = 0; index < cells.length; index++) {
        cells[index].innerText = '';
        cells[index].style.removeProperty('background-color');
        cells[index].addEventListener('click', turnClick, false);
    }
}

function turnClick() {

}