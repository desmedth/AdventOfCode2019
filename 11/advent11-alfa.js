const Computer = require('../IntComputer.js');

// INPUT DATA

let computerCode =
	'3,8,1005,8,358,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,29,1,1104,7,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,54,1,103,17,10,1,7,3,10,2,8,9,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,89,1,1009,16,10,1006,0,86,1006,0,89,1006,0,35,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,124,1,105,8,10,1,2,0,10,1,1106,5,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,158,1,102,2,10,1,109,17,10,1,109,6,10,1,1003,1,10,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,1001,8,0,195,1006,0,49,1,101,5,10,1006,0,5,1,108,6,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,232,2,1102,9,10,1,1108,9,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1002,8,1,262,1006,0,47,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,286,1006,0,79,2,1003,2,10,2,107,0,10,1006,0,89,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,323,1006,0,51,2,5,1,10,1,6,15,10,2,1102,3,10,101,1,9,9,1007,9,905,10,1005,10,15,99,109,680,104,0,104,1,21101,838211572492,0,1,21101,0,375,0,1106,0,479,21102,1,48063328668,1,21102,386,1,0,1106,0,479,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,1,21679533248,1,21101,0,433,0,1105,1,479,21102,235190455527,1,1,21102,444,1,0,1106,0,479,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,837901247244,1,21102,1,467,0,1106,0,479,21101,0,709488169828,1,21102,1,478,0,1105,1,479,99,109,2,22102,1,-1,1,21102,1,40,2,21101,0,510,3,21102,1,500,0,1105,1,543,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,505,506,521,4,0,1001,505,1,505,108,4,505,10,1006,10,537,1102,1,0,505,109,-2,2106,0,0,0,109,4,2101,0,-1,542,1207,-3,0,10,1006,10,560,21101,0,0,-3,21201,-3,0,1,21202,-2,1,2,21102,1,1,3,21102,1,579,0,1105,1,584,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,607,2207,-4,-2,10,1006,10,607,21202,-4,1,-4,1106,0,675,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21101,0,626,0,1106,0,584,22101,0,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,645,21102,1,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,667,22101,0,-1,1,21102,1,667,0,105,1,542,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0';

// USED VARS

let dataArray = computerCode
	.trim()
	.split(',')
	.map((x) => {
		return +x;
	});

function goPaintRobot(startColor) {
	let robot = new Computer(dataArray, true, false);

	let color = startColor;
	let direction = 'N';
	let directionOutput = -1;
	let x = 0;
	let y = 0;
	let tiles = new Map();
	let counter = 0;

	robot.receiveInput(color);

	while (robot.running) {
		if (robot.paused) {
			counter++;
			let output = robot.returnOutputArray();
			if (output.length > 0) {
				directionOutput = output.pop();
				color = output.pop();

				let tileCoord = x + ',' + y;
				let tileValue = { x: x, y: y, color: color, amount: 1 };
				if (tiles.has(tileCoord)) {
					tileValue = tiles.get(tileCoord);
					tileValue.color = color;
					tileValue.amount++;
				}

				tiles.set(x + ',' + y, tileValue);
				direction = calculateDirection(direction, directionOutput);
				let newCoords = calculatePosition(direction, x, y);

				x = newCoords[0];
				y = newCoords[1];

				if (tiles.has(x + ',' + y)) {
					color = tiles.get(x + ',' + y).color;
				} else {
					color = 0;
				}
				robot.receiveInput(color);
			}
		}
	}
	return tiles;
}

console.time('AoC');
let step1Tiles = goPaintRobot(0);
// console.log('FINISH ST1: ' + step1Tiles.size);

let step2Tiles = goPaintRobot(1);
let orderedTiles = sortMap(step2Tiles);

let startX = -Infinity;
let output = 'START';
orderedTiles.forEach(function(value, key, map) {
	let coords = key
		.trim()
		.split(',')
		.map((x) => {
			return +x;
		});
	if (coords[0] > startX) {
		if (output.substr(0, 1) == ' ') {
			// console.log(output.slice(1));
		} else {
			// console.log(output);
		}
		startX = coords[0];
		output = '';
	}

	if (value.color === 0) {
		output += ' ';
	} else {
		output += String.fromCharCode(9619); //9608 - 9619
	}
});
console.timeEnd('AoC');
// console.log(output);
//console.log('END');

function calculateDirection(direction, amplifier) {
	if (amplifier === 0) {
		switch (direction) {
			case 'N':
				direction = 'W';
				break;
			case 'E':
				direction = 'N';
				break;
			case 'S':
				direction = 'E';
				break;
			case 'W':
				direction = 'S';
				break;
			default:
				break;
		}
	} else if (amplifier === 1) {
		switch (direction) {
			case 'N':
				direction = 'E';
				break;
			case 'E':
				direction = 'S';
				break;
			case 'S':
				direction = 'W';
				break;
			case 'W':
				direction = 'N';
				break;
			default:
				break;
		}
	}

	return direction;
}

function calculatePosition(direction, x, y) {
	switch (direction) {
		case 'N':
			x--;
			break;
		case 'E':
			y++;
			break;
		case 'S':
			x++;
			break;
		case 'W':
			y--;
			break;
		default:
			break;
	}

	return [x, y];
}

function sortMap(map) {
	let tupleArray = [];
	map.forEach(function(value, key) {
		tupleArray.push([key, value]);
	});

	tupleArray.sort((a, b) => {
		let aCoords = a[0]
			.trim()
			.split(',')
			.map((x) => {
				return +x;
			});
		let bCoords = b[0]
			.trim()
			.split(',')
			.map((x) => {
				return +x;
			});

		if (aCoords[0] < bCoords[0]) {
			return -1;
		} else if (aCoords[0] === bCoords[0]) {
			if (aCoords[1] < bCoords[1]) {
				return -1;
			} else if (aCoords[1] === bCoords[1]) {
				return 0;
			} else {
				return 1;
			}
		}
		return 1;
	});

	let sortedMap = new Map();
	tupleArray.forEach((element) => {
		sortedMap.set(element[0], element[1]);
	});

	return sortedMap;
}
