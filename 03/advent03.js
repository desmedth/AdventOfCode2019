let data = "";

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
	console.log("start");
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

	console.log(maxBounds);

	let startRow = maxBounds.top;
	let startColumn = maxBounds.left;

	console.log("START: " + startRow + "," + startColumn);

	let rowCnt = startRow;
	let columnCnt = startColumn;

	let line1Coords = Array();

	line1.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);

		switch (side) {
			case "R":
				for (let index = columnCnt; index < columnCnt + amount; index++) {
					line1Coords.push(rowCnt + "," + index);
				}
				columnCnt += amount;
				break;

			case "L":
				for (let index = columnCnt; index > columnCnt - amount; index--) {
					line1Coords.push(rowCnt + "," + index);
				}
				columnCnt -= amount;
				break;
			case "U":
				for (let index = rowCnt; index > rowCnt - amount; index--) {
					line1Coords.push(index + "," + columnCnt);
				}
				rowCnt -= amount;
				break;

			case "D":
				for (let index = rowCnt; index < rowCnt + amount; index++) {
					line1Coords.push(index + "," + columnCnt);
				}
				rowCnt += amount;
				break;

			default:
				break;
		}
	});

	console.log("LINE1 READY");
	console.log(line1Coords.length);

	let line2Coords = Array();
	rowCnt = startRow;
	columnCnt = startColumn;

	line2.forEach(element => {
		let side = element.slice(0, 1);
		let amount = +element.slice(1);

		switch (side) {
			case "R":
				for (let index = columnCnt; index < columnCnt + amount; index++) {
					line2Coords.push(rowCnt + "," + index);
				}
				columnCnt += amount;
				break;

			case "L":
				for (let index = columnCnt; index > columnCnt - amount; index--) {
					line2Coords.push(rowCnt + "," + index);
				}
				columnCnt -= amount;
				break;
			case "U":
				for (let index = rowCnt; index > rowCnt - amount; index--) {
					line2Coords.push(index + "," + columnCnt);
				}
				rowCnt -= amount;
				break;

			case "D":
				for (let index = rowCnt; index < rowCnt + amount; index++) {
					line2Coords.push(index + "," + columnCnt);
				}
				rowCnt += amount;
				break;

			default:
				break;
		}
	});

	console.log("LINE2 READY");
	console.log(line2Coords.length);

	let interSections = Array();

	line1Coords.map(function(x) {
		line2Coords.map(function(y) {
			if (x === y) {
				interSections.push(x);
			}
		});
		console.log("LINE1 coord checked");
	});

	console.log(interSections);
	let short = Infinity;

	interSections.map(function(inter) {
		let coords = inter.split(",");
		let row = Math.abs(coords[0] - startRow);
		let column = Math.abs(coords[1] - startColumn);

		if (row + column < short && row + column > 0) {
			short = row + column;
		}
	});

	console.log(short);
}
