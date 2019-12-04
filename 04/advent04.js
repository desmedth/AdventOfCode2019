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

executeTest();

function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

function executeTest() {
	startTimer("advent04");

	let result = checkPossibilities(prod.start, prod.end);

	console.log("STEP1: " + result.step1);
	console.log("STEP2: " + result.step2);

	stopTimer("advent04");
}

function checkPossibilities(start, end) {
	let diff = end - start;
	let count = 0;
	let step2 = 0;

	for (let index = 0; index <= diff; index++) {
		let number = start + index;

		if (checkSorted(number)) {
			let freq = countDigits(number).sort();
			const goodFreq = freq.filter(digit => digit > 1);
			const bestFreq = freq.filter(digit => digit === 2);

			if (goodFreq.length > 0) {
				count++;
			}

			if (bestFreq.length > 0) {
				step2++;
			}
		}
	}

	return { step1: count, step2: step2 };
}

function checkSorted(number) {
	let digits = ("" + number).split("").map(function(x) {
		return +x;
	});
	let sortedDigits = digits.slice().sort();

	for (let i = 0; i < digits.length; i++) {
		if (digits[i] != sortedDigits[i]) {
			return false;
		}
	}

	return true;
}

function countDigits(number) {
	let elements = [],
		frequence = [],
		prev = -1;

	let digits = ("" + number)
		.split("")
		.map(function(x) {
			return +x;
		})
		.sort();

	for (let i = 0; i < digits.length; i++) {
		if (digits[i] !== prev) {
			elements.push(digits[i]);
			frequence.push(1);
		} else {
			frequence[frequence.length - 1]++;
		}
		prev = digits[i];
	}

	return frequence;
}
