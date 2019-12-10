let data = '';
let dataFile = 'input.txt';
let day = 10;

let filesrc = 'http://127.0.0.1:5500/' + day + '/' + dataFile;

// ASTEROID CLASS
class Asteroid {
	constructor(coordX, coordY, id, mapWidth, mapHeight) {
		this.id = id;
		this.coords = [coordX, coordY];
		this.viewableAsteroids = new Map();
		this.blockedAsteroids = new Map();
		this.blockedCoords = new Map();
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
	}

	addAsteroid(ast) {
		// console.log('ADD ASTEROID');
		// console.log(ast);
		let astCoordKey = ast.coords[0] + ',' + ast.coords[1];
		// console.log('ADD: ' + astCoordKey);
		if (this.blockedCoords.has(astCoordKey)) {
			let blockingAsteroid = this.blockedCoords.get(astCoordKey);
			let lambdaXBlock = Math.abs(blockingAsteroid.coords[0] - this.coords[0]);
			let lambdaXAst = Math.abs(ast.coords[0] - this.coords[0]);
			let lambdaYBlock = Math.abs(blockingAsteroid.coords[1] - this.coords[1]);
			let lambdaYAst = Math.abs(ast.coords[1] - this.coords[1]);

			if (lambdaXBlock > lambdaXAst || lambdaYBlock > lambdaYAst) {
				// console.log('REMOVE + ADD BLOCK + ADD VIEW');
				this.removeViewable(blockingAsteroid.coords[0] + ',' + blockingAsteroid.coords[1]);
				this.blockedAsteroids.set(blockingAsteroid.coords[0] + ',' + blockingAsteroid.coords[1], ast);
				this.viewableAsteroids.set(astCoordKey, ast);
			} else {
				// console.log('ADD BLOCK');
				this.blockedAsteroids.set(astCoordKey, ast);
				// console.log([...this.blockedCoords]);
				return;
			}
		} else {
			// console.log('ADD VIEW');
			this.viewableAsteroids.set(astCoordKey, ast);
		}
		this.calculateBlockedCoords(ast);
		// console.log([...this.blockedCoords]);
	}

	calculateBlockedCoords(ast) {
		let lambdaX = ast.coords[0] - this.coords[0];
		let lambdaY = ast.coords[1] - this.coords[1];

		let gcdFactor = gcd_two_numbers(lambdaX === 0 ? 1 : lambdaX, Math.abs(lambdaY === 0 ? 1 : lambdaY));

		let counterX = Math.abs(lambdaX) / gcdFactor;
		let counterY = Math.abs(lambdaY) / gcdFactor;

		// console.log([ast, lambdaX, lambdaY, counterX, counterY]);

		if (lambdaX === 0) {
			let x = this.coords[0];
			if (lambdaY < 0) {
				// console.log('EQUAL X - LEFT');
				for (let y = this.coords[1] - 1; y >= 0; y--) {
					this.blockedCoords.set(x + ',' + y, ast);
				}
			} else {
				// console.log('EQUAL X - RIGHT');
				for (let y = this.coords[1] + 1; y < this.mapWidth; y++) {
					this.blockedCoords.set(x + ',' + y, ast);
				}
			}
		} else if (lambdaX > 0) {
			if (lambdaY < 0) {
				// console.log('HIGHER X - LEFT');
				let x = this.coords[0] + counterX;
				let y = this.coords[1] - counterY;

				while (x < this.mapHeight && y >= 0) {
					this.blockedCoords.set(x + ',' + y, ast);
					x += counterX;
					y -= counterY;
				}
			} else if (lambdaY > 0) {
				// console.log('HIGHER X - RIGHT');
				let x = this.coords[0] + counterX;
				let y = this.coords[1] + counterY;

				while (x < this.mapHeight && y < this.mapWidth) {
					this.blockedCoords.set(x + ',' + y, ast);
					x += counterX;
					y += counterY;
				}
			} else if (lambdaY === 0) {
				// console.log('HIGHER X - EQUAL');
				let y = this.coords[1];
				for (let x = this.coords[0] + 1; x < this.mapHeight; x++) {
					this.blockedCoords.set(x + ',' + y, ast);
				}
			}
		} else {
			if (lambdaY < 0) {
				// console.log('LOWER X - LEFT');
				let x = this.coords[0] - counterX;
				let y = this.coords[1] - counterY;

				while (x >= 0 && y >= 0) {
					this.blockedCoords.set(x + ',' + y, ast);
					x -= counterX;
					y -= counterY;
				}
			} else if (lambdaY > 0) {
				// console.log('LOWER X - RIGHT');
				let x = this.coords[0] - counterX;
				let y = this.coords[1] + counterY;

				while (x >= 0 && y < this.mapWidth) {
					this.blockedCoords.set(x + ',' + y, ast);
					x -= counterX;
					y += counterY;
				}
			} else if (lambdaY === 0) {
				// console.log('LOWER X - EQUAL');
				let y = this.coords[1];
				for (let x = this.coords[0] - 1; x >= 0; x--) {
					this.blockedCoords.set(x + ',' + y, ast);
				}
			}
		}
	}

	removeViewable(asteroidCoord) {
		this.viewableAsteroids.delete(asteroidCoord);
	}
}

function gcd_two_numbers(x, y) {
	if (typeof x !== 'number' || typeof y !== 'number') return false;
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
}

function sortMap(map) {
	let tupleArray = [];
	map.forEach(function(value, key) {
		tupleArray.push([key, value]);
	});

	tupleArray.sort((a, b) => {
		return +a[0] - +b[0];
	});

	let sortedMap = new Map();
	tupleArray.forEach((element) => {
		sortedMap.set(element[0], element[1]);
	});

	return sortedMap;
}

function executeTest() {
	let asteroidBelt = Array();
	let dataArray = data.trim().split('\n');

	let mapHeight = dataArray.length;
	let mapWidth = 0;

	dataArray.map(function(dataLine, idx) {
		let lineArray = dataLine.trim().split('');
		mapWidth = lineArray.length;
		lineArray.map(function(dataPoint, idy) {
			if (dataPoint === '#') {
				let asteroid = new Asteroid(idx, idy, asteroidBelt.length, mapWidth, mapHeight);
				asteroidBelt.push(asteroid);
			}
		});
	});

	let maxDestinations = 0;
	let laserId = -1;

	asteroidBelt.forEach((asteroid) => {
		// console.log('EXTERNAL: ' + asteroid.id);

		asteroidBelt.forEach((checkAsteroid) => {
			// console.log('INTERNAL: ' + checkAsteroid.id);
			if (asteroid.id === checkAsteroid.id) {
				return;
			} else {
				asteroid.addAsteroid(checkAsteroid);
			}
		});

		if (asteroid.viewableAsteroids.size > maxDestinations) {
			maxDestinations = asteroid.viewableAsteroids.size;
			laserId = asteroid.id;
		}
	});

	//console.log(asteroidBelt);
	// console.log('ST1: ' + maxDestinations + ' @ ' + laserId);
	vaporateAsteroids(asteroidBelt, laserId, 200, mapWidth, mapHeight);
}

function vaporateAsteroids(asteroidBelt, laserId, treshold, mapWidth, mapHeight) {
	let asteroidAngle = function(sx, sy, ex, ey) {
		return (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;
	};
	let laserBase = asteroidBelt[laserId];
	// console.log(laserBase);
	let viewableAsteroids = asteroidBelt[laserId].viewableAsteroids;
	let viewAble = viewableAsteroids.size;
	let bingoPoint = 0;
	let vaporCount = 0;
	let startX = laserBase.coords[0];
	let startY = laserBase.coords[1];
	let angledAsteroids = new Map();

	viewableAsteroids.forEach((element) => {
		angledAsteroids.set(Math.abs(asteroidAngle(startX, startY, element.coords[0], element.coords[1]) - 180), element);
	});

	angledAsteroids = sortMap(angledAsteroids);

	if (viewAble > treshold) {
		for (const [key, asteroid] of angledAsteroids) {
			// console.log('BOOM: ' + asteroid.coords[0] + ',' + asteroid.coords[1]);
			vaporCount++;
			if (vaporCount === treshold) {
				bingoPoint = asteroid.coords[1] * 100 + asteroid.coords[0];
				break;
			}
		}
	}

	// console.log('ST2: ' + bingoPoint);
}

// READ FILE AND START PROGRAM
let rawFile = new XMLHttpRequest();
rawFile.open('GET', filesrc, false);
rawFile.onreadystatechange = function() {
	if (rawFile.readyState === 4) {
		if (rawFile.status === 200 || rawFile.status == 0) {
			data = rawFile.responseText;
			console.time('AoC 2019');
			executeTest();
			console.timeEnd('AoC 2019');
		}
	}
};
rawFile.send(null);
