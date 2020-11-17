class Morpion {
	constructor(player) {
		this.player = player;
		this.ia = (player == "J1") ? "J2" : "J1";
		this.turn = 0;
		this.history = [];

		this.map = [];
		for (let i = 0; i < 3; i++) {
			this.map[i] = [];  // [[], [], []]
			for (let j = 0; j < 3; j++) {
				this.map[i][j] = "EMPTY"; 

				document.getElementById(this.getZone(i, j)).onclick = () => this.playerTurn(i, j);
			}
		}

		// [["j1", "j2", "EMPTY"], 
		//  ["j1", "EMPTY", "EMPTY"], 
		//  ["EMPTY", "EMPTY", "EMPTY"]] 

		this.finish = false;
		if (this.ia === "J1")
			this.iaTurn();
	}

	getZone = (x, y) => {
		const column = x + 1
		if (y === 0) return `A${column}`;
		if (y === 1) return `B${column}`;
		return `C${column}`;
	}

	checkDraw = () => {
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				if (this.map[x][y] === "EMPTY")
					return false;
			}
		}
		return true;
	}

	fillGrid = (x, y, player) => {
		const image = (player === this.player) ? 'croix' : 'rond';
		const zone = this.getZone(x, y);

		if (this.map[x][y] !== "EMPTY") {
			return false;
		}
			
		this.map[x][y] = player;
		this.saveTurn(x, y, player);

		document.getElementById(zone).style.backgroundImage = `url(image-morpion/${image}.png)`;
		document.getElementById(zone).className += " filled";
		this.checking(player);
		return true;
	}

	emptyGrid = (x, y) => {
		this.map[x][y] = "EMPTY";

		const zone = this.getZone(x, y);
		document.getElementById(zone).style.backgroundImage = "";
		document.getElementById(zone).classList.remove("filled");
	}

	checking = (player) => {
		const one = this.map[0][0];
		const two = this.map[0][1];
		const three = this.map[0][2];
		const four = this.map[1][0];
		const five = this.map[1][1];
		const six = this.map[1][2];
		const seven = this.map[2][0];
		const eight = this.map[2][1];
		const nine = this.map[2][2];
		if (one === two && one === three && one != "EMPTY" ||
			four === five && four === six && four != "EMPTY" ||
			seven === eight && seven === nine && seven != "EMPTY" ||
			one === five && one === nine && one != "EMPTY" ||
			three === five && three === seven && three != "EMPTY" ||
			one === four && one === seven && one != "EMPTY" ||
			two === five && two === eight && two != "EMPTY" ||
			three === six && three === nine && three != "EMPTY") {
			this.finish = true;
			if (player == this.ia) {
				document.getElementById('win').textContent = 'L\'IA a gagné !';
			} else if (player == this.player) {
				document.getElementById('win').textContent = 'Tu as battu l\'IA !';
			}
		}
		else if (this.checkDraw()) {
			document.getElementById('win').textContent = "Vous êtes à égalité";
			this.finish = true;
		}
	}

	winningLine(a, b, c) {
		return a == b && b == c && a != "EMPTY";
	}

	 
	checkWinner() {
		let winner = null;
		for (let i = 0; i < 3; i++) {
			if (this.winningLine(this.map[i][0], this.map[i][1], this.map[i][2])) {
				winner = this.map[i][0];
			}
			if (this.winningLine(this.map[0][i], this.map[1][i], this.map[2][i])) {
				winner = this.map[0][i];
			}
		}
		if (this.winningLine(this.map[0][0], this.map[1][1], this.map[2][2])) {
			winner = this.map[0][0];
		}
		if (this.winningLine(this.map[2][0], this.map[1][1], this.map[0][2])) {
			winner = this.map[2][0];
		}
		if (winner === null && this.turn === 9) {
			return "draw";
		} else {
			return winner;
		}
	}

	playerTurn = (x, y) => {
		if (this.finish)
			return;
		if (!this.fillGrid(x, y, this.player))
			return alert('La case n\'est pas vide');
		else if (!this.finish)
			this.iaTurn();
	}

	minimax = (board, depth, isMaximizing) => {
		let result = this.checkWinner();
		if (result == this.ia) return 10 - depth;
		else if (result == this.player) return depth - 10;
		else if (result != null) return depth;

		if (isMaximizing) {
			let bestScore = -Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j] == "EMPTY") {
						board[i][j] = this.ia;
						this.turn++;
						let score = this.minimax(board, depth + 1, false);
						board[i][j] = "EMPTY";
						this.turn--;
						if (score > bestScore) {
							bestScore = score;
						}
					}
				}
			}
			return bestScore;
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j] == "EMPTY") {
						board[i][j] = this.player;
						this.turn++;
						let score = this.minimax(board, depth + 1, true);
						board[i][j] = "EMPTY";
						this.turn--;
						if (score < bestScore) {
							bestScore = score;
						}
					}
				}
			}
			return bestScore;
		}
	}

	iaTurn = () => {
		let depth = 0;
		let bestScore = -Infinity;
		let move;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.map[i][j] == "EMPTY") {
					this.map[i][j] = this.ia;
					this.turn++;
					let score = this.minimax(this.map, depth + 1, false);
					this.map[i][j] = "EMPTY";
					this.turn--;
					if (score > bestScore) {
						bestScore = score;
						move = { i, j };
					}
				}
			}
		}
		this.fillGrid(move.i, move.j, this.ia);
	}

	saveTurn = (x, y, player) => {
		this.history.push({x, y, player})
	}

	

	undo = () => {
		const previousTurnIndex = this.history.length - 2
		if (previousTurnIndex < 0) {
			return
		}
		const previousTurn = this.history[previousTurnIndex]
		const previousIaTurn = this.history[previousTurnIndex + 1]
		this.emptyGrid(previousTurn.x, previousTurn.y)
		this.emptyGrid(previousIaTurn.x, previousIaTurn.y)

		console.log(this.history)
	}

	redo = () => {
		console.log(this.history)
	}
}

const morpion = new Morpion("J2");