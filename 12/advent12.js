let startIo = { x: 12, y: 0, z: -15 };
let startEuropa = { x: -8, y: -5, z: -10 };
let startGanymede = { x: 7, y: -17, z: 1 };
let startCallisto = { x: 2, y: -11, z: -6 };

let test1A = { x: -1, y: 0, z: 2 };
let test1B = { x: 2, y: -10, z: -7 };
let test1C = { x: 4, y: -8, z: 8 };
let test1D = { x: 3, y: 5, z: -1 };

let test2A = { x: -8, y: -10, z: 0 };
let test2B = { x: 5, y: 5, z: 10 };
let test2C = { x: 2, y: -7, z: 3 };
let test2D = { x: 9, y: -8, z: -3 };

// runSimulation(1000);
let orbitalPositions = new Map();
calculatePattern();

function runSimulation(steps = Infinity) {
	let moons = Array();
	let finished = false;

	moons[0] = { position: startIo, velocity: { x: 0, y: 0, z: 0 } };
	moons[1] = { position: startEuropa, velocity: { x: 0, y: 0, z: 0 } };
	moons[2] = { position: startGanymede, velocity: { x: 0, y: 0, z: 0 } };
	moons[3] = { position: startCallisto, velocity: { x: 0, y: 0, z: 0 } };

	let counter = 0;
	while (!finished) {
		moons = calculateStep(moons);

		moons.forEach((moon) => {
			moon.position.x += moon.velocity.x;
			moon.position.y += moon.velocity.y;
			moon.position.z += moon.velocity.z;
		});

		counter++;
		finished = counter === steps;
	}

	let totalEnergy = 0;
	moons.forEach((moon) => {
		let moonPosEnergy = Math.abs(moon.position.x) + Math.abs(moon.position.y) + Math.abs(moon.position.z);
		let moonVelEnergy = Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z);
		totalEnergy += moonPosEnergy * moonVelEnergy;
	});

	console.log(totalEnergy);
}

function calculatePattern() {
	let moons = Array();
	let finished = false;

	moons[0] = { position: test1A, velocity: { x: 0, y: 0, z: 0 } };
	moons[1] = { position: test1B, velocity: { x: 0, y: 0, z: 0 } };
	moons[2] = { position: test1C, velocity: { x: 0, y: 0, z: 0 } };
	moons[3] = { position: test1D, velocity: { x: 0, y: 0, z: 0 } };

	let initState = { x: 0, y: 0, z: 0 };

	moons.forEach((moon) => {
		initState.x += Math.abs(moon.position.x);
		initState.y += Math.abs(moon.position.y);
		initState.z += Math.abs(moon.position.z);
	});

	let repeatX = calculateRepeat('x', [...moons], initState);
	console.log('X: ' + repeatX);
	let repeatY = calculateRepeat('y', [...moons], initState);
	console.log('Y: ' + repeatY);
	let repeatZ = calculateRepeat('z', [...moons], initState);
	console.log('Z: ' + repeatZ);

	let lowOne = lcm_two_numbers(repeatX, repeatY);
	console.log(lcm_two_numbers(lowOne, repeatZ));
}

function calculateRepeat(axis, moons, initState) {
	let counter = 0;
	let finished = false;

	while (!finished) {
		counter++;
		moons = calculateStep(moons);
		let newState = 0;
		let velocity = 0;

		moons.forEach((moon) => {
			moon.position.x += moon.velocity.x;
			moon.position.y += moon.velocity.y;
			moon.position.z += moon.velocity.z;
			newState += Math.abs(moon.position[axis]);
			velocity += Math.abs(moon.velocity[axis]);
		});

		finished = velocity === 0 && initState[axis] === newState;

		finished = finished || counter === 500000;
	}

	return counter;
}

function lcm_two_numbers(x, y) {
	if (typeof x !== 'number' || typeof y !== 'number') return false;
	return !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}

function gcd_two_numbers(x, y) {
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		let t = y;
		y = x % y;
		x = t;
	}
	return x;
}

function checkCurrentVelocity(moons) {
	let universePosition = { px: 0, py: 0, pz: 0, vx: 0, vy: 0, vz: 0 };

	moons.forEach((moon) => {
		universePosition.vx += Math.abs(moon.velocity.x);
		universePosition.vy += Math.abs(moon.velocity.y);
		universePosition.vz += Math.abs(moon.velocity.z);
	});

	let universeTxt = stringifyOrbital(universePosition);

	return universeTxt;
}

function stringifyMoon(moon) {
	return (
		moon.position.x +
		',' +
		moon.position.y +
		',' +
		moon.position.z +
		':' +
		moon.velocity.x +
		',' +
		moon.velocity.y +
		',' +
		moon.velocity.z
	);
}

function stringifyOrbital(orbitalPos) {
	return (
		orbitalPos.px +
		',' +
		orbitalPos.py +
		',' +
		orbitalPos.pz +
		':' +
		orbitalPos.vx +
		',' +
		orbitalPos.vy +
		',' +
		orbitalPos.vz
	);
}

function calculateVelocity(moonA, moonB) {
	let Avelocity = { x: 0, y: 0, z: 0 };
	let Bvelocity = { x: 0, y: 0, z: 0 };

	if (moonA.position.x < moonB.position.x) {
		Avelocity.x = 1;
		Bvelocity.x = -1;
	} else if (moonA.position.x > moonB.position.x) {
		Avelocity.x = -1;
		Bvelocity.x = 1;
	}

	if (moonA.position.y < moonB.position.y) {
		Avelocity.y = 1;
		Bvelocity.y = -1;
	} else if (moonA.position.y > moonB.position.y) {
		Avelocity.y = -1;
		Bvelocity.y = 1;
	}

	if (moonA.position.z < moonB.position.z) {
		Avelocity.z = 1;
		Bvelocity.z = -1;
	} else if (moonA.position.z > moonB.position.z) {
		Avelocity.z = -1;
		Bvelocity.z = 1;
	}

	return [Avelocity, Bvelocity];
}

function calculateStep(moonArray) {
	let moons = [...moonArray];

	let moonCntr = 0;
	let antiMoonCntr = 1;

	while (moonCntr < moons.length - 1) {
		antiMoonCntr = moonCntr + 1;

		while (antiMoonCntr < moons.length) {
			let resultVel = calculateVelocity(moons[moonCntr], moons[antiMoonCntr]);

			moons[moonCntr].velocity.x += resultVel[0].x;
			moons[moonCntr].velocity.y += resultVel[0].y;
			moons[moonCntr].velocity.z += resultVel[0].z;

			moons[antiMoonCntr].velocity.x += resultVel[1].x;
			moons[antiMoonCntr].velocity.y += resultVel[1].y;
			moons[antiMoonCntr].velocity.z += resultVel[1].z;

			antiMoonCntr++;
		}
		moonCntr++;
	}

	return moons;
}
