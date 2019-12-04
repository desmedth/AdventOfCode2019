let data = "";

let filesrc = "http://127.0.0.1:5500/01/input.txt";

let rawFile = new XMLHttpRequest();
rawFile.open("GET", filesrc, false);
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
	console.time("advent01");
	let dataArr = data.split("\n");
	let sum = 0;

	dataArr = dataArr.map(function(i) {
		if (i.length > 0) {
			return Math.floor(+i / 3) - 2;
		} else {
			return null;
		}
	});

	//console.log(dataArr);

	dataArr.map(function(i) {
		let fuel = i;
		while (fuel > 0) {
			sum += fuel;
			fuel = Math.floor(fuel / 3) > 2 ? Math.floor(fuel / 3) - 2 : 0;
		}
	});

	//console.log(sum);
	console.timeEnd("advent01");
}
