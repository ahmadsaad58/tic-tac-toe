// Steps: 
// 	1. Basic Setup 
// 	2. Determine Winner
// 	3. Basic AI and Winner Notification
// 	4. minimax algo

var origBoard;
//sign the players use
const humanPlayer = 'O';
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

function turnClick(square) {
	//means human played
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer);
		if (!checkTie(humanPlayer)) {
			turn(bestSpot(), aiPlayer);
		}
	}

}

function checkTie(player) {
	let gameWon = checkWin(origBoard, player);
	if (openSpots().length == 0 && !gameWon) {
		for (var index = 0; index < cells.length; index++) {
			cells[index].style.backgroundColor = "green";
			cells[index].removeEventListener("click", turnClick, false);
		}
		declareWinner("It's a Tie!")
		return true;
	}
	return false;
}

function openSpots() {
	return origBoard.filter(s => typeof s == 'number');
}
function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function minimax(board, player) {
	var openSpots = openSpots(); 
	if (checkWin(board, humanPlayer)){
		return {score: -10};
	} else if (checkWin(board, aiPlayer)) {
		return {score: 10};
	} else if (openSpots.length == 0) {
		return {score: 0};
	}
}

function turn(squareID, player) {
	origBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) {
		gameOver(gameWon);
	}
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
	}
	//makes sure you can't keep playing by deleting event listener
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "WINNER" : "LOSER");
}

function declareWinner(player) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = player;
}