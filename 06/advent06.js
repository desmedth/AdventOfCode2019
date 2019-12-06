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

function executeTest() {
	let dataArray = data.trim().split('\n');

	let starMap = drawStarMap(dataArray);

	let connections = 0;

	console.log(starMap);

	starMap.map(function(star) {
		connections += star.links;
	});
}

function drawStarMap(connectionData) {
	let starMap = Array();
	let totalConnections = 0;
	connectionData.map(function(point) {
		let pointData = point.split(')');
		let star = { name: pointData[1].toString().trim(), parent: pointData[0].toString().trim(), links: 1 };

		starMap.push(star);
	});

	starMap.map(function(star) {
		star.links = searchStarConnections(star, starMap);
		totalConnections += star.links;
	});

	console.log(totalConnections);

	return starMap;
}

function searchStarConnections(star, starMap) {
	let links = star.links;
	let parentStar = searchStarParent(star, starMap);

	while (parentStar >= 0) {
		links++;
		parentStar = searchStarParent(starMap[parentStar], starMap);
	}

	return links;
}

function searchStarParent(star, starMap) {
	const checkParent = (mapPoint) => mapPoint.name === star.parent;
	let parentStar = starMap.findIndex(checkParent);

	return parentStar;
}
