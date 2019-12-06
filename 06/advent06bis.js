let data = '';

let filesrc = 'http://127.0.0.1:5500/06/input.txt';

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

function startTimer(label) {
	console.time(label);
}

function stopTimer(label) {
	console.timeEnd(label);
}

function executeTest() {
	startTimer('advent06');
	let dataArray = data.trim().split('\n');
	let starMap = buildStarMap(dataArray);
	let connections = calculateConnections(starMap);
	//console.log('STEP1: ' + (connections.direct + connections.indirect));
	let injection = calculateOrbitalInjection(starMap, 'YOU', 'SAN');
	//console.log('STEP2: ' + injection);
	stopTimer('advent06');
}

function buildStarMap(mapData) {
	let initData = [...mapData];
	let starMap = [];

	while (initData.length > 0) {
		let starInit = initData.pop();
		let starData = starInit
			.trim()
			.split(')')
			.map(function(x) {
				return x.trim();
			});

		let star = { name: starData[1], parent: starData[0] };

		starMap[star.name] = star;
	}

	return starMap;
}

function calculateConnections(starMap) {
	let connections = {
		direct: 0,
		indirect: 0
	};

	let direct = 0;
	let indirect = 0;

	for (let key in starMap) {
		direct++;
		let parent = starMap[key].parent;
		let flightPath = [parent];

		while (parent !== 'COM') {
			indirect++;
			parent = starMap[parent].parent;
			flightPath.push(parent);
		}
		starMap[key].flightPath = flightPath;
	}

	connections.direct = direct;
	connections.indirect = indirect;

	return connections;
}

function calculateOrbitalInjection(starMap, from, to) {
	let pathFrom = starMap[from].flightPath;
	let pathTo = starMap[to].flightPath;

	let injection = 0;

	for (let idx = 0; idx < pathFrom.length; idx++) {
		const star = pathFrom[idx];
		let interDist = pathTo.findIndex(function(x) {
			return x === star;
		});

		if (interDist >= 0) {
			injection = interDist + idx;
			break;
		}
	}

	return injection;
}
