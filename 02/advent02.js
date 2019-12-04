let data = "";

let filesrc = "http://127.0.0.1:5500/02/input.txt";

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
	console.time("advent02");
	let dataArr = data.split(",");
	let needed = 19690720;
	let checksum = 0;
	let couple = [0, 0];

	dataArr = dataArr.map(function(i) {
		return +i;
	});
	let workArr = dataArr.slice();

	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			workArr = dataArr.slice();
			workArr[1] = noun;
			workArr[2] = verb;

			for (let index = 0; index < workArr.length; index += 4) {
				let opcode = workArr[index];
				let elem1 = workArr[index + 1];
				let elem2 = workArr[index + 2];
				let output = workArr[index + 3];
				let result = 0;

				if (opcode === 1) {
					result = workArr[elem1] + workArr[elem2];
					workArr[output] = result;
				} else if (opcode === 2) {
					result = workArr[elem1] * workArr[elem2];
					workArr[output] = result;
				} else if (opcode === 99) {
					break;
				}
			}

			checksum = workArr[0];
			if (checksum === needed) {
				couple[1] = verb;
				break;
			}
		}
		if (checksum === needed) {
			couple[0] = noun;
			break;
		}
	}

	//console.log(workArr);
	//console.log(couple);

	//console.log(couple[0] * 100 + couple[1]);
	console.timeEnd("advent02");
}
