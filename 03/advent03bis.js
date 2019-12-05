let data = "";
let line1Coords = Array();
let line2Coords = Array();

let test1 = "R8,U5,L5,D3\nU7,R6,D4,L4";
let test2 =
	"R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83";
let test3 =
	"R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

let filesrc = "http://127.0.0.1:5500/03/input.txt";

let rawFile = new XMLHttpRequest();
rawFile.open("GET", filesrc, false);
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
	console.time("advent03");
	//console.log("start: ");
	//data = test3;
	data = data.trim();
	let rows = data.split("\n");

	let line1 = rows[0].split(",");
	let line2 = rows[1].split(",");

	let line1Bounds = { left: 0, right: 0, top: 0, bottom: 0 };
	let line2Bounds = { left: 0, right: 0, top: 0, bottom: 0 };

	let maxBounds = { left: 0, right: 0, top: 0, bottom: 0 };

	line1.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);

		switch (side) {
			case "R":
				line1Bounds.right += amount;
				line1Bounds.left -= amount;

				if (line1Bounds.right > maxBounds.right) {
					maxBounds.right = line1Bounds.right;
				}
				break;

			case "L":
				line1Bounds.left += amount;
				line1Bounds.right -= amount;
				if (line1Bounds.left > maxBounds.left) {
					maxBounds.left = line1Bounds.left;
				}
				break;
			case "U":
				line1Bounds.top += amount;
				line1Bounds.bottom -= amount;
				if (line1Bounds.top > maxBounds.top) {
					maxBounds.top = line1Bounds.top;
				}
				break;

			case "D":
				line1Bounds.bottom += amount;
				line1Bounds.top -= amount;
				if (line1Bounds.bottom > maxBounds.bottom) {
					maxBounds.bottom = line1Bounds.bottom;
				}
				break;

			default:
				break;
		}
	});

	line2.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);

		switch (side) {
			case "R":
				line2Bounds.right += amount;
				line2Bounds.left -= amount;

				if (line2Bounds.right > maxBounds.right) {
					maxBounds.right = line2Bounds.right;
				}
				break;

			case "L":
				line2Bounds.left += amount;
				line2Bounds.right -= amount;
				if (line2Bounds.left > maxBounds.left) {
					maxBounds.left = line2Bounds.left;
				}
				break;
			case "U":
				line2Bounds.top += amount;
				line2Bounds.bottom -= amount;
				if (line2Bounds.top > maxBounds.top) {
					maxBounds.top = line2Bounds.top;
				}
				break;

			case "D":
				line2Bounds.bottom += amount;
				line2Bounds.top -= amount;
				if (line2Bounds.bottom > maxBounds.bottom) {
					maxBounds.bottom = line2Bounds.bottom;
				}
				break;

			default:
				break;
		}
	});

	let startRow = maxBounds.top;
	let startColumn = maxBounds.left;

	//console.log("START: " + startRow + "," + startColumn);

	let rowCnt = startRow;
	let columnCnt = startColumn;
	let step = 0;

	line1.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);
		let coord = {};

		coord.start = { x: rowCnt, y: columnCnt, step: step };
		switch (side) {
			case "R":
				columnCnt += amount;
				break;

			case "L":
				columnCnt -= amount;
				break;
			case "U":
				rowCnt -= amount;
				break;

			case "D":
				rowCnt += amount;
				break;

			default:
				break;
		}
		coord.end = { x: rowCnt, y: columnCnt, path: amount };

		line1Coords.push(coord);
		step++;
	});

	//console.log("LINE1 READY");

	rowCnt = startRow;
	columnCnt = startColumn;
	step = 0;

	line2.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);
		let coord = {};

		coord.start = { x: rowCnt, y: columnCnt, step: step };
		switch (side) {
			case "R":
				columnCnt += amount;
				break;

			case "L":
				columnCnt -= amount;
				break;
			case "U":
				rowCnt -= amount;
				break;

			case "D":
				rowCnt += amount;
				break;

			default:
				break;
		}
		coord.end = { x: rowCnt, y: columnCnt, path: amount };

		line2Coords.push(coord);
		step++;
	});

	//console.log("LINE2 READY");

	let intersections = [];

	line1Coords.map(function(coord1) {
		line2Coords.map(function(coord2) {
			if (intersectCheck(coord1, coord2)) {
				intersections.push([coord1, coord2]);
			}
		});
	});

	let short = Infinity;
	let shortSteps = Infinity;

	intersections.map(function(interPoint) {
		let interCoord = calculateIntersectionCoord(interPoint[0], interPoint[1]);
		let row = Math.abs(interCoord.x - startRow);
		let column = Math.abs(interCoord.y - startColumn);

		if (row + column < short && row + column > 0) {
			short = row + column;
		}
		let steps = calculatePathToIntersection(interCoord, shortSteps);

		if (steps < shortSteps) {
			shortSteps = steps;
		}
	});

	//console.log("SHORT: " + short + " - STEPS: " + shortSteps);
	console.timeEnd("advent03");
}

function intersectCheck(vector1, vector2) {
	let det, gamma, lambda;

	det =
		(vector1.end.x - vector1.start.x) * (vector2.end.y - vector2.start.y) -
		(vector2.end.x - vector2.start.x) * (vector1.end.y - vector1.start.y);

	if (det === 0) {
		return false;
	} else {
		lambda =
			((vector2.end.y - vector2.start.y) * (vector2.end.x - vector1.start.x) +
				(vector2.start.x - vector2.end.x) * (vector2.end.y - vector1.start.y)) /
			det;
		gamma =
			((vector1.start.y - vector1.end.y) * (vector2.end.x - vector1.start.x) +
				(vector1.end.x - vector1.start.x) * (vector2.end.y - vector1.start.y)) /
			det;

		return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
	}
}

function calculateIntersectionCoord(vector1, vector2) {
	let interX = 0;
	let interY = 0;

	if (vector1.start.x === vector1.end.x) {
		interX = vector1.start.x;
		interY = vector2.start.y;
	} else {
		interX = vector2.start.x;
		interY = vector1.start.y;
	}

	return { x: interX, y: interY };
}

function calculatePathToIntersection(interCoord, shortSteps) {
	let distance = 0;
	let line1Steps = 0,
		line2Steps = 0;

	for (let index = 0; index < line1Coords.length; index++) {
		const point = line1Coords[index];
		distance = 0;
		if (point.start.x === point.end.x && interCoord.x === point.start.x) {
			if (point.start.y > point.end.y) {
				distance = point.start.y - interCoord.y;
			} else {
				distance = interCoord.y - point.start.y;
			}
			line1Steps += distance;
			break;
		} else if (interCoord.y === point.start.y) {
			if (point.start.x > point.end.x) {
				distance = point.start.x - interCoord.x;
			} else {
				distance = interCoord.x - point.start.x;
			}
			line1Steps += distance;
			break;
		} else {
			distance = point.end.path;
		}
		line1Steps += distance;
		if (line1Steps > shortSteps) {
			break;
		}
	}

	for (let index = 0; index < line2Coords.length; index++) {
		const point = line2Coords[index];
		distance = 0;
		if (point.start.x === point.end.x && interCoord.x === point.start.x) {
			if (point.start.y > point.end.y) {
				distance = point.start.y - interCoord.y;
			} else {
				distance = interCoord.y - point.start.y;
			}
			line2Steps += distance;
			break;
		} else if (interCoord.y === point.start.y) {
			if (point.start.x > point.end.x) {
				distance = point.start.x - interCoord.x;
			} else {
				distance = interCoord.x - point.start.x;
			}
			line2Steps += distance;
			break;
		} else {
			distance = point.end.path;
		}
		line2Steps += distance;
		if (line2Steps > shortSteps - line1Steps) {
			break;
		}
	}

	return line1Steps + line2Steps;
}
