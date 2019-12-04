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

for (let index = 0; index < 50; index++) {
	executeTest();
}

function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

function executeTest() {
	startTimer("advent04");

	let result = checkPossibilities(prod.start, prod.end);

	//console.log("STEP1: " + result.step1);
	//console.log("STEP2: " + result.step2);

	stopTimer("advent04");
}

function checkPossibilities(start, end) {
	let diff = end - start;
	let count = 0;
	let step2 = 0;

	for (let index = 0; index <= diff; index++) {
		let number = start + index;

		let data = generateMetaData(number);

		if (data.ident) {
			let freq = data.freq.sort();
			const goodFreq = freq.filter(digit => digit > 1);
			const bestFreq = freq.filter(digit => digit === 2);

			if (goodFreq.length > 0) {
				count++;
				if (bestFreq.length > 0) {
					step2++;
				}
			}
		}
	}

	return { step1: count, step2: step2 };
}

function generateMetaData(number) {
	let digits = ("" + number).split("").map(function(x) {
		return +x;
	});

	let sortedDigits = digits.slice().sort();

	let elements = [],
		frequence = [],
		prev = -1,
		simCount = 0;

	for (let i = 0; i < digits.length; i++) {
		if (digits[i] === sortedDigits[i]) {
			simCount++;
		}
		if (digits[i] !== prev) {
			elements.push(digits[i]);
			frequence.push(1);
		} else {
			frequence[frequence.length - 1]++;
		}
		prev = digits[i];
	}

	return { ident: simCount === digits.length, freq: frequence };
}

/*

const range = input.split('-').map(Number);
let part1 = 0
let part2 = 0
for (let i = range[0]; i <= range[1]; i++) {
  let digits = i.toString().split('').map(Number)
  let groups: number[] = [];
  let decrease = false;
  digits.reduce((prev, curr) => {
    if (prev === curr) {
      groups[groups.length - 1]++;
    } else {
      groups.push(1)
    }

    if (curr < prev) {
      decrease = true
    }

    return curr
  }, -1)

  if (!decrease) {
    if (groups.some(group => group >= 2)) part1++
    if (groups.some(group => group === 2)) part2++
  }
}

*/
