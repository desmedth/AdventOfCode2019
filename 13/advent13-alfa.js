let data = '';
let dataFile = 'input.txt';
let day = 13;
let arcadeGame;

let filesrc = 'http://127.0.0.1:5500/' + day + '/' + dataFile;

// READ FILE AND START PROGRAM
let rawFile = new XMLHttpRequest();
rawFile.open('GET', filesrc, false);
rawFile.onreadystatechange = function() {
	if (rawFile.readyState === 4) {
		if (rawFile.status === 200 || rawFile.status == 0) {
			data = rawFile.responseText;

			executeTest();
		}
	}
};
rawFile.send(null);

function executeTest() {
	let dataArray = data
		.trim()
		.split(',')
		.map((x) => {
			return +x;
		});
	console.time('AoC 2019');
	arcadeGame = new Computer(dataArray, true, false);
	let startState = arcadeGame.returnOutputArray();

	let gameBoard = drawGame([...startState]);

	playGame(gameBoard);
	console.timeEnd('AoC 2019');
}

function drawGame(initState) {
	let gameBoard = Array();
	let x = -1;
	let y = -1;
	let blocks = 0;

	for (let index = 0; index < initState.length; index += 3) {
		const xPos = initState[index];
		const yPos = initState[index + 1];
		const state = initState[index + 2];

		if (xPos === -1) {
			continue;
		}

		if (xPos != x) {
			if (gameBoard[xPos] == undefined) {
				gameBoard[xPos] = new Array();
			}
		}

		if (state === 2) {
			blocks++;
		}

		x = xPos;
		y = yPos;

		gameBoard[x][y] = state;
	}

	//console.log(blocks);
	return gameBoard;
}

function playGame(gameBoard) {
	let left = -1;
	let right = 1;
	let stay = 0;
	let counter = 0;
	let gameState = Array();

	let ball = findBall(gameBoard);
	let paddle = findPaddle(gameBoard);
	if (ball[0] < paddle[0]) {
		arcadeGame.receiveInput(left);
	} else if (ball[0] > paddle[0]) {
		arcadeGame.receiveInput(right);
	} else {
		arcadeGame.receiveInput(stay);
	}

	while (arcadeGame.running) {
		if (arcadeGame.paused) {
			gameState = arcadeGame.returnOutputArray();
			let newState = insertGameState(gameState, gameBoard);
			//console.log(newState);
			ball = newState[0].length === 2 ? newState[0] : findBall(gameBoard);
			paddle = newState[1].length === 2 ? newState[1] : findPaddle(gameBoard);

			if (ball[0] < paddle[0]) {
				arcadeGame.receiveInput(left);
			} else if (ball[0] > paddle[0]) {
				arcadeGame.receiveInput(right);
			} else {
				arcadeGame.receiveInput(stay);
			}
		}
	}

	//drawScore(arcadeGame.returnOutputArray());
}

function findBall(gameBoard) {
	for (let index = 0; index < gameBoard.length; index++) {
		const element = gameBoard[index];
		for (let idx = 0; idx < element.length; idx++) {
			const pixel = element[idx];
			if (pixel === 4) {
				return [index, idx];
			}
		}
	}
	return [0, 0];
}

function findPaddle(gameBoard) {
	for (let index = 0; index < gameBoard.length; index++) {
		const element = gameBoard[index];
		for (let idx = 0; idx < element.length; idx++) {
			const pixel = element[idx];
			if (pixel === 3) {
				return [index, idx];
			}
		}
	}
	return [0, 0];
}

function insertGameState(gameState, gameBoard) {
	let ball = [];
	let paddle = [];
	for (let index = 0; index < gameState.length; index += 3) {
		const xPos = gameState[index];
		const yPos = gameState[index + 1];
		const state = gameState[index + 2];

		if (xPos === -1) {
			continue;
		} else if (state === 4) {
			ball = [xPos, yPos];
		} else if (state === 3) {
			paddle = [xPos, yPos];
		}

		gameBoard[xPos][yPos] = state;
	}

	return [ball, paddle];
}

function drawScore(scoreArray) {
	for (let index = 0; index < scoreArray.length; index += 3) {
		const element = scoreArray[index];
		if (element === -1) {
			console.log('SCORE: ' + scoreArray[index + 2]);
		}
	}
}
