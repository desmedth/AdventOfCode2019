let dataTable;
let data = '';

let testData1 = [1, 0, 0, 0, 99];
let testData2 = [2, 3, 0, 3, 99];
let testData3 = [2, 4, 4, 5, 99, 0];
let testData4 = [1, 1, 1, 4, 99, 5, 6, 0, 99];

data =
	'3,225,1,225,6,6,1100,1,238,225,104,0,1101,82,10,225,101,94,44,224,101,-165,224,224,4,224,1002,223,8,223,101,3,224,224,1,224,223,223,1102,35,77,225,1102,28,71,225,1102,16,36,225,102,51,196,224,101,-3468,224,224,4,224,102,8,223,223,1001,224,7,224,1,223,224,223,1001,48,21,224,101,-57,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,2,188,40,224,1001,224,-5390,224,4,224,1002,223,8,223,101,2,224,224,1,224,223,223,1101,9,32,224,101,-41,224,224,4,224,1002,223,8,223,1001,224,2,224,1,223,224,223,1102,66,70,225,1002,191,28,224,101,-868,224,224,4,224,102,8,223,223,101,5,224,224,1,224,223,223,1,14,140,224,101,-80,224,224,4,224,1002,223,8,223,101,2,224,224,1,224,223,223,1102,79,70,225,1101,31,65,225,1101,11,68,225,1102,20,32,224,101,-640,224,224,4,224,1002,223,8,223,1001,224,5,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,8,226,226,224,1002,223,2,223,1006,224,329,101,1,223,223,1008,677,677,224,102,2,223,223,1006,224,344,101,1,223,223,1107,226,677,224,102,2,223,223,1005,224,359,101,1,223,223,1008,226,226,224,1002,223,2,223,1006,224,374,1001,223,1,223,1108,677,226,224,1002,223,2,223,1006,224,389,1001,223,1,223,7,677,226,224,1002,223,2,223,1006,224,404,101,1,223,223,7,226,226,224,1002,223,2,223,1005,224,419,101,1,223,223,8,226,677,224,1002,223,2,223,1006,224,434,1001,223,1,223,7,226,677,224,1002,223,2,223,1006,224,449,1001,223,1,223,107,226,677,224,1002,223,2,223,1005,224,464,1001,223,1,223,1007,677,677,224,102,2,223,223,1005,224,479,101,1,223,223,1007,226,226,224,102,2,223,223,1005,224,494,1001,223,1,223,1108,226,677,224,102,2,223,223,1005,224,509,101,1,223,223,1008,677,226,224,102,2,223,223,1005,224,524,1001,223,1,223,1007,677,226,224,102,2,223,223,1005,224,539,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,554,101,1,223,223,108,226,226,224,102,2,223,223,1005,224,569,101,1,223,223,108,677,677,224,102,2,223,223,1005,224,584,101,1,223,223,1107,226,226,224,1002,223,2,223,1006,224,599,101,1,223,223,8,677,226,224,1002,223,2,223,1006,224,614,1001,223,1,223,108,677,226,224,102,2,223,223,1006,224,629,1001,223,1,223,1107,677,226,224,1002,223,2,223,1006,224,644,1001,223,1,223,107,677,677,224,102,2,223,223,1005,224,659,101,1,223,223,107,226,226,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226';

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
function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

executeTest();

function executeTest() {
	startTimer('advent05');

	let input;
	let dataArr = data.split(',');
	dataArr.map(function(x) {
		return +x;
	});
	dataTable = [...dataArr].map(function(x) {
		return +x;
	});
	input = 1;
	runIntCodeComputer(input);

	input = 5;
	dataTable = [...dataArr].map(function(x) {
		return +x;
	});
	runIntCodeComputer(input);

	stopTimer('advent05');
}

function runIntCodeComputer(input) {
	let position = 0;
	let run = true;

	while (run && position < dataTable.length && position >= 0) {
		let stepResult = executeIntCode(position, input);
		position = stepResult.position;
		run = stepResult.run;
	}
}

function executeIntCode(position, input) {
	let result = { run: false, position: -1 };

	let opcode = dataTable[position];

	if (opcode < 10) {
		if (opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8) {
			let parameter1 = dataTable[position + 1];
			let parameter2 = dataTable[position + 2];
			let solutionIdx = dataTable[position + 3];
			executeOperation(0, opcode, dataTable[parameter1], dataTable[parameter2], solutionIdx);
			result.run = true;
			result.position = position + 4;
		} else if (opcode === 3 || opcode === 4) {
			let solutionIdx = dataTable[position + 1];
			executeOperation(input, opcode, 0, 0, solutionIdx);
			result.run = true;
			result.position = position + 2;
		} else if (opcode === 5 || opcode === 6) {
			let element = dataTable[position + 1];
			let pointer = dataTable[position + 2];

			switch (opcode) {
				case 5:
					if (dataTable[element] !== 0) {
						result.run = true;
						result.position = dataTable[pointer];
					} else {
						result.run = true;
						result.position = position + 3;
					}
					break;

				default:
					if (dataTable[element] === 0) {
						result.run = true;
						result.position = dataTable[pointer];
					} else {
						result.run = true;
						result.position = position + 3;
					}
					break;
			}
		}
	} else if (opcode === 99) {
		result.run = false;
		result.position = -1;
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
			let element = dataTable[position + 1];
			let adder = dataTable[position + 2];
			let idx = dataTable[position + 3];

			if (opcodeVars[0] === 0) {
				element = dataTable[element];
			}

			if (opcodeVars[1] === 0) {
				adder = dataTable[adder];
			}

			executeOperation(input, opcodeDigit, element, adder, idx);

			result.run = true;
			result.position = position + 4;
		} else if (opcodeDigit === 5 || opcodeDigit === 6) {
			let element = dataTable[position + 1];
			let pointer = dataTable[position + 2];

			if (opcodeVars[0] === 0) {
				element = dataTable[element];
			}

			if (opcodeVars[1] === 0) {
				pointer = dataTable[pointer];
			}

			switch (opcodeDigit) {
				case 5:
					if (element !== 0) {
						result.run = true;
						result.position = pointer;
					} else {
						result.run = true;
						result.position = position + 3;
					}
					break;

				default:
					if (element === 0) {
						result.run = true;
						result.position = pointer;
					} else {
						result.run = true;
						result.position = position + 3;
					}
					break;
			}
		} else if (opcodeDigit === 3 || opcodeDigit === 4) {
			result.run = true;
			result.position = position + 2;
			let idx = position + 1;

			if (opcodeVars[0] === 0) {
				idx = dataTable[position + 1];
			}

			executeOperation(input, opcodeDigit, 0, 0, idx);
		}
	}
	return result;
}

function executeOperation(input = 0, opcode = 99, parameter1 = 0, parameter2 = 0, solutionIdx = 0) {
	switch (opcode) {
		case 1:
			dataTable[solutionIdx] = parameter1 + parameter2;
			break;
		case 2:
			dataTable[solutionIdx] = parameter1 * parameter2;
			break;
		case 3:
			dataTable[solutionIdx] = input;
			break;
		case 4:
			let output = dataTable[solutionIdx];
			//if (output !== 0) {
			//	console.log('OUTPUT: ' + dataTable[solutionIdx]);
			//}
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			if (parameter1 < parameter2) {
				dataTable[solutionIdx] = 1;
			} else {
				dataTable[solutionIdx] = 0;
			}
			break;
		case 8:
			if (parameter1 === parameter2) {
				dataTable[solutionIdx] = 1;
			} else {
				dataTable[solutionIdx] = 0;
			}
			break;
		default:
			break;
	}
}
