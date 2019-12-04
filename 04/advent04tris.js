let test1 = {
	start: 100,
	end: 115
};

let test2 = {
	start: 20,
	end: 25
};

let test3 = {
	start: 200,
	end: 220
};

let prod = {
	start: 124075,
	end: 580769
};

//for (let index = 0; index < 50; index++) {
executeTest();
//}

function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

function executeTest() {
	startTimer("advent04");

	let result = checkPossibilities(prod.start, prod.end);

	stopTimer("advent04");

	console.log("STEP1: " + result.step1);
	console.log("STEP2: " + result.step2);
}

function checkPossibilities(start, end) {
	const range = [start, end];
	let part1 = 0,
		part2 = 0;

	for (let i = range[0]; i <= range[1]; i++) {
		let digits = i
			.toString()
			.split("")
			.map(x => {
				return +x;
			});
		let groups = [];
		let decrease = false;
		digits.reduce((prev, curr) => {
			if (prev === curr) {
				groups[groups.length - 1]++;
			} else {
				groups.push(1);
			}

			if (curr < prev) {
				decrease = true;
			}

			return curr;
		}, -1);

		if (!decrease) {
			if (groups.some(group => group >= 2)) part1++;
			if (groups.some(group => group === 2)) part2++;
		}
	}

	return { step1: part1, step2: part2 };
}
