let data = '';
let dataFile = 'testData1.txt';
let day = 10;

let filesrc = 'http://127.0.0.1:5500/' + day + '/' + dataFile;

// ASTEROID CLASS
class Asteroid {
	constructor(coordX, coordY, id, mapWidth, mapHeight) {
		this.id = id;
		this.coords = [coordX, coordY];
		this.viewableAsteroids = Array();
		this.blockedAsteroids = Array();
		this.blockedCoords = Array();
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
	}

	addAsteroid(ast) {
		let indexBlocked = this.blockedCoords.findIndex((coord) => {
			return coord[0] === ast.coords[0] && coord[1] === ast.coords[1];
		});
		if (indexBlocked >= 0) {
			let lambdaBlockX = Math.abs(this.blockedCoords[indexBlocked][2].coords[0] - ast.coords[0]);
			let lambdaX = Math.abs(this.coords[0] - ast.coords[0]);
			if (lambdaX < lambdaBlockX) {
				this.removeViewable(this.blockedCoords[indexBlocked][2].id);
				this.viewableAsteroids.push(ast);
				this.blockedAsteroids.push(this.blockedCoords[indexBlocked][2]);
			} else {
				let lambdaBlockY = Math.abs(this.blockedCoords[indexBlocked][2].coords[1] - ast.coords[1]);
				let lambdaY = Math.abs(this.coords[1] - ast.coords[1]);
				if (lambdaY < lambdaBlockY) {
					this.removeViewable(this.blockedCoords[indexBlocked][2].id);
					this.viewableAsteroids.push(ast);
					this.blockedAsteroids.push(this.blockedCoords[indexBlocked][2]);
				} else {
					this.blockedAsteroids(ast);
				}
			}
		} else {
			this.viewableAsteroids.push(ast);
			this.calculateBlockedCoords(ast);
		}
	}

	calculateBlockedCoords(ast) {
		let lambdaX = Math.abs(this.coords[0] - ast.coords[0]);
		let lambdaY = Math.abs(this.coords[1] - ast.coords[1]);

		let gcdCoords = this.gcd(lambdaX, lambdaY);

		let counterX = lambdaX / gcdCoords;
		let counterY = lambdaY / gcdCoords;

		if (ast.coords[0] < this.coords[0]) {
			if (ast.coords[1] < this.coords[1]) {
				for (let x = this.coords[0]; x > ast.coords[0]; x -= counterX) {
					for (let y = this.coords[1]; y > ast.coords[1]; y -= counterY) {
						this.blockedCoords.push([x, y, ast]);
					}
				}
			} else {
				for (let x = this.coords[0]; x > ast.coords[0]; x -= counterX) {
					for (let y = this.coords[1]; y < ast.coords[1]; y += counterY) {
						this.blockedCoords.push([x, y, ast]);
					}
				}
			}
		} else {
			if (ast.coords[1] < this.coords[1]) {
				for (let x = this.coords[0]; x < ast.coords[0]; x += counterX) {
					for (let y = this.coords[1]; y > ast.coords[1]; y -= counterY) {
						this.blockedCoords.push([x, y, ast]);
					}
				}
			} else {
				for (let x = this.coords[0]; x < ast.coords[0]; x += counterX) {
					for (let y = this.coords[1]; y < ast.coords[1]; y += counterY) {
						this.blockedCoords.push([x, y, ast]);
					}
				}
			}
		}
	}

	removeViewable(asteroidId) {
		let removeIndex = this.viewableAsteroids.findIndex((x) => {
			return x.id === asteroidId;
		});

		this.viewableAsteroids.splice(removeIndex, 1);
	}

	gcd(a, b) {
		if (b === 0) {
			return a;
		}

		return this.gcd(b, a % b);
	}
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
				asteroidBelt.forEach((element) => {
					element.addAsteroid(asteroid);
				});
				asteroidBelt.push(asteroid);
			}
		});
	});

	console.log(asteroidBelt);
}

// READ FILE AND START PROGRAM
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
