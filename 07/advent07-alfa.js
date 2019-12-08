let dataTable;
let data = '';
let output = 0;

let testData1 = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
let testData2 = [3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0];
let testData3 = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0];

let testDataP201 = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];
let testDataP202 = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

data =
	'3,8,1001,8,10,8,105,1,0,0,21,38,47,64,85,106,187,268,349,430,99999,3,9,1002,9,4,9,1001,9,4,9,1002,9,4,9,4,9,99,3,9,1002,9,4,9,4,9,99,3,9,1001,9,3,9,102,5,9,9,1001,9,5,9,4,9,99,3,9,101,3,9,9,102,5,9,9,1001,9,4,9,102,4,9,9,4,9,99,3,9,1002,9,3,9,101,2,9,9,102,4,9,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99';

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
	startTimer('advent07');
  
	// let dataArr = data.split(',');
	// dataArr.map(function(x) {
	// 	return +x;
	// });
	// dataTable = [...dataArr].map(function(x) {
	// 	return +x;
  // });

  let dataArr = data;  
  let maxThrust = -1;
  let accSignal = Array(5).fill(0);
  let outputs = Array(5).fill(0);
  let a = 0, b = 0, c = 0, d = 0, e = 0;

  while (a < 5)
  {
    runAmplifier(dataArr, a, 0);
    outputs[0] = output;

    while (b < 5)
    {
      if (a === b)
      {
        b++
        continue;
      }

      runAmplifier(dataArr, b, outputs[0])
      outputs[1] = output;

      while (c < 5)
      {
        if (a === c || b === c)
        {
          c++
          continue;
        }

        runAmplifier(dataArr, c, outputs[1]);
        outputs[2] = output;

        while (d < 5)
        {
          if (a === d || b === d || c === d)
          {
            d++;
            continue;
          }
          
          runAmplifier(dataArr, d, outputs[2])
          outputs[3] = output;

          while (e < 5)
          {
            if (a === e || b === e || c === e || d === e)
            {
              e++;
              continue;
            }

            runAmplifier(dataArr, e, outputs[3])
						outputs[4] = output;
						
						if (output > maxThrust)
						{
							maxThrust = output;
							accSignal = [a,b,c,d,e];
						}

            e++;
          }

          d++;
          e = 0;
        }

        c++;
        d = 0;
      }

      b++;
      c = 0;
    }

    a++;
    b = 0;
  }

  console.log("AccSignal: "+accSignal);
  console.log("MaxThrust: "+maxThrust);
	stopTimer('advent07');
}

function runIntCodeComputer(input) {
	let position = 0;
  let run = true;
  
  let stepResult = executeIntCode(position, input);
  position = stepResult.position;
	run = stepResult.run;

	while (run && position < dataTable.length && position >= 0) {
		stepResult = executeIntCode(position, output);
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
      output = dataTable[solutionIdx];
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

function runAmplifier (data, inp, outp)
{
  dataTable = [...data].map(function(x) {
    return +x;
  });
  output = outp;

  runIntCodeComputer(inp);
}