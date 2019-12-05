let data = '';
let dataTable = [];

let testData1 = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
let testData2 = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
let testData3 = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
let testData4 = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
let testData5 = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
let testData6 = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
let testData7 = [
	3,
	21,
	1008,
	21,
	8,
	20,
	1005,
	20,
	22,
	107,
	8,
	21,
	20,
	1006,
	20,
	31,
	1106,
	0,
	36,
	98,
	0,
	0,
	1002,
	21,
	125,
	20,
	4,
	20,
	1105,
	1,
	46,
	104,
	999,
	1105,
	1,
	46,
	1101,
	1000,
	1,
	20,
	4,
	20,
	1105,
	1,
	46,
	98,
	99
];
/*
let filesrc = 'http://127.0.0.1:5500/05/input.txt';

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
*/

executeTest();

function executeTest() {
	console.time('advent05');
	data =
		'3,225,1,225,6,6,1100,1,238,225,104,0,1101,82,10,225,101,94,44,224,101,-165,224,224,4,224,1002,223,8,223,101,3,224,224,1,224,223,223,1102,35,77,225,1102,28,71,225,1102,16,36,225,102,51,196,224,101,-3468,224,224,4,224,102,8,223,223,1001,224,7,224,1,223,224,223,1001,48,21,224,101,-57,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,2,188,40,224,1001,224,-5390,224,4,224,1002,223,8,223,101,2,224,224,1,224,223,223,1101,9,32,224,101,-41,224,224,4,224,1002,223,8,223,1001,224,2,224,1,223,224,223,1102,66,70,225,1002,191,28,224,101,-868,224,224,4,224,102,8,223,223,101,5,224,224,1,224,223,223,1,14,140,224,101,-80,224,224,4,224,1002,223,8,223,101,2,224,224,1,224,223,223,1102,79,70,225,1101,31,65,225,1101,11,68,225,1102,20,32,224,101,-640,224,224,4,224,1002,223,8,223,1001,224,5,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,8,226,226,224,1002,223,2,223,1006,224,329,101,1,223,223,1008,677,677,224,102,2,223,223,1006,224,344,101,1,223,223,1107,226,677,224,102,2,223,223,1005,224,359,101,1,223,223,1008,226,226,224,1002,223,2,223,1006,224,374,1001,223,1,223,1108,677,226,224,1002,223,2,223,1006,224,389,1001,223,1,223,7,677,226,224,1002,223,2,223,1006,224,404,101,1,223,223,7,226,226,224,1002,223,2,223,1005,224,419,101,1,223,223,8,226,677,224,1002,223,2,223,1006,224,434,1001,223,1,223,7,226,677,224,1002,223,2,223,1006,224,449,1001,223,1,223,107,226,677,224,1002,223,2,223,1005,224,464,1001,223,1,223,1007,677,677,224,102,2,223,223,1005,224,479,101,1,223,223,1007,226,226,224,102,2,223,223,1005,224,494,1001,223,1,223,1108,226,677,224,102,2,223,223,1005,224,509,101,1,223,223,1008,677,226,224,102,2,223,223,1005,224,524,1001,223,1,223,1007,677,226,224,102,2,223,223,1005,224,539,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,554,101,1,223,223,108,226,226,224,102,2,223,223,1005,224,569,101,1,223,223,108,677,677,224,102,2,223,223,1005,224,584,101,1,223,223,1107,226,226,224,1002,223,2,223,1006,224,599,101,1,223,223,8,677,226,224,1002,223,2,223,1006,224,614,1001,223,1,223,108,677,226,224,102,2,223,223,1006,224,629,1001,223,1,223,1107,677,226,224,1002,223,2,223,1006,224,644,1001,223,1,223,107,677,677,224,102,2,223,223,1005,224,659,101,1,223,223,107,226,226,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226';
	let dataArr = data.split(',');
	dataArr.map(function(x) {
		return +x;
	});
	dataTable = [...dataArr].map(function(x) {
		return +x;
	});
	let input = 1;

	IntCodeComputer(input);
	dataTable = [...dataArr].map(function(x) {
		return +x;
	});
	input = 5;
	IntCodeComputer(input);

	console.timeEnd('advent05');
}

function IntCodeComputer(input) {
	let jumper = { status: true, value: 0 };
	let opcode = dataTable[0];
	jumper = ICCExecute(opcode, 0, input);

	for (let index = jumper.value; index < dataTable.length; index += jumper.value) {
		opcode = dataTable[index];
		jumper = ICCExecute(opcode, index);
		if (!jumper.status) {
			if (jumper.value === -1) {
				break;
			} else {
				index = jumper.value;
				jumper.value = 0;
			}
		}
	}
}

function ICCExecute(opcode, index, input = 0) {
	let jumper = { status: true, value: 0 };

	if (opcode < 10) {
		if (opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8) {
			let element = +dataTable[index + 1];
			let adder = +dataTable[index + 2];
			let result = +dataTable[index + 3];
			jumper.value = 4;
			jumper.status = true;
			ICCOperation(opcode, dataTable[element], dataTable[adder], result);
		} else if (opcode === 3 || opcode === 4) {
			jumper.value = 2;
			jumper.status = true;
			let result = dataTable[index + 1];
			ICCOperation(opcode, 0, 0, result, input);
		} else if (opcode === 5 || opcode === 6) {
			jumper.status = false;
			let element = +dataTable[index + 1];
			let pointer = +dataTable[index + 2];

			switch (opcode) {
				case 5:
					if (element !== 0) {
						jumper.value = dataTable[pointer];
					} else {
						jumper.status = true;
						jumper.value = 3;
					}
					break;

				default:
					if (element === 0) {
						jumper.value = dataTable[pointer];
					} else {
						jumper.status = true;
						jumper.value = 3;
					}
					break;
			}
		}
	} else if (opcode === 99) {
		jumper.status = false;
		jumper.value = -1;
	} else {
		let opcodeParts = ('' + opcode).split('').map(function(x) {
			return +x;
		});
		let opcodeDigit = opcodeParts.slice(-2);
		opcodeDigit = +(opcodeDigit[0] + '' + opcodeDigit[1]);
		let opcodeVars = opcodeParts.slice(0, -2);
		if (opcodeVars.length < 3) {
			opcodeVars = Array(3 - opcodeVars.length)
				.fill(0)
				.concat([...opcodeVars])
				.reverse();
		}

		if (opcodeDigit === 1 || opcodeDigit === 2 || opcodeDigit === 7 || opcodeDigit === 8) {
			let element = dataTable[index + 1];
			let adder = dataTable[index + 2];
			let result = dataTable[index + 3];

			if (opcodeVars[0] === 0) {
				element = dataTable[element];
			}

			if (opcodeVars[1] === 0) {
				adder = dataTable[adder];
			}

			ICCOperation(opcodeDigit, element, adder, result);
			jumper.status = true;
			jumper.value = 4;
		} else if (opcodeDigit === 5 || opcodeDigit === 6) {
			jumper.status = false;
			let element = dataTable[index + 1];
			let pointer = dataTable[index + 2];

			if (opcodeVars[0] === 0) {
				element = dataTable[element];
			}

			if (opcodeVars[1] === 0) {
				pointer = dataTable[pointer];
			}

			switch (opcodeDigit) {
				case 5:
					if (element !== 0) {
						jumper.value = dataTable[pointer];
					} else {
						jumper.status = true;
						jumper.value = 3;
					}
					break;

				default:
					if (element === 0) {
						jumper.value = dataTable[pointer];
					} else {
						jumper.status = true;
						jumper.value = 3;
					}
					break;
			}
		} else if (opcodeDigit === 3 || opcodeDigit === 4) {
			jumper.value = 2;
			jumper.status = true;
			let result = dataTable[index + 1];
			ICCOperation(opcodeDigit, 0, 0, result, input);
		}
	}

	return jumper;
}

function ICCOperation(opcode, element = 0, adder = 0, resultCoord = 0, input = 0) {
	switch (opcode) {
		case 1:
			dataTable[resultCoord] = element + adder;
			break;
		case 2:
			dataTable[resultCoord] = element * adder;
			break;
		case 3:
			dataTable[resultCoord] = input;
			break;
		case 4:
			console.info('OUTPUT: ' + dataTable[resultCoord]);
			break;
		case 7:
			if (element < adder) {
				dataTable[resultCoord] = 1;
			} else {
				dataTable[resultCoord] = 0;
			}
			break;
		case 8:
			if (element === adder) {
				dataTable[resultCoord] = 1;
			} else {
				dataTable[resultCoord] = 0;
			}
			break;
		default:
			break;
	}
}
