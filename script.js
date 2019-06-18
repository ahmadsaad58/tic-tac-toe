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
	//checks whether the game is a tie or not
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
	//finds the open spots
	return origBoard.filter(s => typeof s == 'number');
}
function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
	var emptySpots = openSpots();

	//sets the scores
	if (checkWin(newBoard, humanPlayer)) {
		return { score: -10 };
	} else if (checkWin(newBoard, aiPlayer)) {
		return { score: 10 };
	} else if (emptySpots.length == 0) {
		return { score: 0 };
	}

	//finds the moves and recalls the function
	var moves = [];
	for (var i = 0; i < emptySpots.length; i++) {
		var move = {};
		move.index = newBoard[emptySpots[i]];
		newBoard[emptySpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[emptySpots[i]] = move.index;
		if ((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10)) {
			return move;
		} else {
			moves.push(move);
		}
		//moves.push(move);
	}

	//gets the best move
	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	//returns the best move, a move object
	return moves[bestMove];
}

function turn(squareID, player) {
	//plays a turn
	origBoard[squareID] = player;
	document.getElementById(squareID).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) {
		gameOver(gameWon);
	}
}

function checkWin(board, player) {
	//check the win
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
	winner = gameWon.player;
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = winner == humanPlayer ? "blue" : "red";
	}
	//makes sure you can't keep playing by deleting event listener
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}

	declareWinner(winner == humanPlayer ? "WINNER" : "LOSER");
	if (winner == humanPlayer) {
		setCookie()
	}
}

function declareWinner(player) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = player;
}

// function checkCookie() {
// 	var user = getCookie("username");
// 	if (user != "") {
// 		alert("Welcome again " + user);
// 	} else {
// 		user = prompt("Please enter your name:", "");
// 		if (user != "" && user != null) {
// 			setCookie("username", user, 30);
// 		}
// 	}
// }

function setCookie() {
	var user = prompt("You won! Please enter your name:", "");
	if (user != "" && user != null) {
		document.cookie = user + "=" + ";path=/";
	}
}

// function getCookie(cname) {
// 	var name = cname + "=";
// 	console.log(document.cookie);
// 	var decodedCookie = decodeURIComponent(document.cookie);
// 	var ca = decodedCookie.split(';');
// 	for (var i = 0; i < ca.length; i++) {
// 		var c = ca[i];
// 		while (c.charAt(0) == ' ') {
// 			c = c.substring(1);
// 		}
// 		if (c.indexOf(name) == 0) {
// 			return c.substring(name.length, c.length);
// 		}
// 	}
// 	return "";
// }