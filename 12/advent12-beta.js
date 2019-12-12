let test1 = '-1,0,2*2,-10,-7*4,-8,8*3,5,-1';
let test2 = '-8,-10,0*5,5,10*2,-7,3*9,-8,-3';

let prod = '12,0,-15*-8,-5,-10*7,-17,1*2,-11,-6';

const inputRaw = prod.split('*');
const moons = inputRaw.map((x) =>
	x.split(',').map((y) => {
		return +y;
	})
);

const velocities = moons.map((x) => [0, 0, 0]);

console.time('AoC');
console.log(energyAfter(moons, 1000));
console.log(calculateNullPosition(moons));
console.timeEnd('AoC');

function copyArray(input) {
	const newArr = new Array();

	for (let index = 0; index < input.length; index++) {
		newArr.push([...input[index]]);
	}

	return newArr;
}

function energyAfter(input, steps) {
	let veloRun = copyArray(velocities);
	let posRun = copyArray(input);

	let counter = 0;

	while (counter < steps) {
		counter++;
		moveMoons(posRun, veloRun);
	}

	return totalEnergy(posRun, veloRun);
}

function moveMoons(positions, velocities) {
	positions.forEach((px, idx) => {
		positions.forEach((py) => {
			for (let index = 0; index < 3; index++) {
				if (px[index] > py[index]) {
					velocities[idx][index]--;
				} else if (px[index] < py[index]) {
					velocities[idx][index]++;
				}
			}
		});
	});

	for (let index = 0; index < positions.length; index++) {
		for (let idx = 0; idx < 3; idx++) {
			positions[index][idx] += velocities[index][idx];
		}
	}
}

function totalEnergy(positions, velocities) {
	const potArr = positions.map((x) => {
		let sum = 0;
		x.forEach((element) => {
			sum += Math.abs(element);
		});
		return sum;
	});

	const kinArr = velocities.map((x) => {
		let sum = 0;
		x.forEach((element) => {
			sum += Math.abs(element);
		});
		return sum;
	});

	let sum = 0;
	for (let index = 0; index < positions.length; index++) {
		sum += potArr[index] * kinArr[index];
	}

	return sum;
}

function sameOrbitPoint(axis, posArr1, posArr2) {
	for (let index = 0; index < Math.min(posArr1.length, posArr2.length); index++) {
		if (posArr1[index][axis] !== posArr2[index][axis]) {
			return false;
		}
	}
	return true;
}

function calculateNullPosition(input) {
	const origin = copyArray(input);
	const originVel = copyArray(velocities);
	const orbits = Array(3).fill(0);

	const posRun = copyArray(origin);
	const veloRun = copyArray(originVel);
	let steps = 0;

	while (orbits.indexOf(0) > -1 && steps < 100000000) {
		moveMoons(posRun, veloRun);
		steps++;

		for (let index = 0; index < orbits.length; index++) {
			const orbitPoint = orbits[index];
			if (orbitPoint === 0 && sameOrbitPoint(index, origin, posRun) && sameOrbitPoint(index, originVel, veloRun)) {
				orbits[index] = steps;
			}
		}
	}

	return lcm(orbits);
}

function lcm(numbers) {
	if (numbers.length === 0) {
		return 0;
	}

	let lcmVal = numbers[0];

	for (let index = 0; index < numbers.length; index++) {
		lcmVal = (lcmVal * numbers[index]) / gcd(lcmVal, numbers[index]);
	}

	return lcmVal;
}

function gcd(a, b) {
	if (b === 0) {
		return a;
	}
	return gcd(b, a % b);
}
