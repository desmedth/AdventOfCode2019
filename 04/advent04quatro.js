let test1 = {
	start: 111110,
	end: 111120
};

let test2 = {
	start: 222250,
	end: 222310
};

let test3 = {
	start: 230516,
	end: 330069
};

let prod = {
	start: 124075,
	end: 580769
};

executeTest(prod.start, prod.end);

function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

function executeTest(startVal, endVal) {
	startTimer('advent04');

	let result = checkPossibilities(startVal, endVal);

	console.log('STEP1: ' + result.step1);
	console.log('STEP2: ' + result.step2);

	stopTimer('advent04');
}

function checkPossibilities(start, end) {
	let startDigits = ('' + start)
		.trim()
		.split('')
		.map((x) => {
			return +x;
		});
	let endDigits = ('' + end)
		.trim()
		.split('')
		.map((x) => {
			return +x;
		});

	let countPos = 0;
	let countCor = 0;
	let previous = -1;

	for (let idx = 0; idx < startDigits.length; idx++) {
		const digit = startDigits[idx];
		if (previous > digit) {
			for (let index = idx; index < startDigits.length; index++) {
				startDigits[index] = previous;
			}
			break;
		} else {
			previous = digit;
		}
	}

	previous = -1;
	for (let idx = 0; idx < endDigits.length; idx++) {
		const digit = endDigits[idx];
		if (previous > digit) {
			endDigits[idx - 1] = previous - 1;
			for (let index = idx; index < endDigits.length; index++) {
				endDigits[index] = 9;
			}
			break;
		} else {
			previous = digit;
		}
	}

	let a, b, c, d, e, f, digits;
	let aEnd, beend, cEnd, dEnd, eEnd, fEnd;
	aEnd = endDigits[0];

	a = startDigits[0];

	while (a <= aEnd) {
		b = a === startDigits[0] ? startDigits[1] : a;
		bEnd = a === endDigits[0] ? endDigits[1] : 9;
		while (b <= bEnd) {
			c = a === startDigits[0] && b === startDigits[1] ? startDigits[2] : b;
			cEnd = b === endDigits[1] ? endDigits[2] : 9;
			while (c <= cEnd) {
				d = a === startDigits[0] && b === startDigits[1] && c === startDigits[2] ? startDigits[3] : c;
				dEnd = c === endDigits[2] ? endDigits[3] : 9;
				while (d <= dEnd) {
					e =
						a === startDigits[0] && b === startDigits[1] && c === startDigits[2] && d === startDigits[3]
							? startDigits[4]
							: d;
					eEnd = d === endDigits[3] ? endDigits[4] : 9;
					while (e <= eEnd) {
						f =
							a === startDigits[0] &&
							b === startDigits[1] &&
							c === startDigits[2] &&
							d === startDigits[3] &&
							e === startDigits[4]
								? startDigits[5]
								: e;
						fEnd = e === endDigits[4] ? endDigits[5] : 9;
						while (f <= fEnd) {
							digits = Array(10).fill(0);
							//console.log([a, b, c, d, e, f]);
							digits[a]++;
							digits[b]++;
							digits[c]++;
							digits[d]++;
							digits[e]++;
							digits[f]++;
							//console.log(digits);
							//console.log(digits.some((digit) => digit >= 2) + ' - ' + digits.some((digit) => digit === 2));
							//console.log('---');
							if (digits.some((digit) => digit >= 2)) countPos++;
							if (digits.some((digit) => digit === 2)) countCor++;
							f++;
						}
						e++;
					}
					d++;
				}
				c++;
			}
			b++;
		}
		a++;
	}

	return { step1: countPos, step2: countCor };
}
