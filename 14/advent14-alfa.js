// GENERAL VARS
let data = '';
let dataFile = 'test03.txt';
let day = 14;

let testResults = [31, 165];

let filesrc = 'http://127.0.0.1:5500/' + day + '/' + dataFile;

// PROGRAM VARS
let reactions = {};
let oreInput = 1000000000000;

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

// PROGRAM

function executeTest() {
	let dataArray = data.trim().split('\n');

	createReactionDB(dataArray);
	let fuelRecipe = calculateFuelRecipe();
	console.log(reactions);
	console.log(fuelRecipe);
	console.log('STEP 1: ' + fuelRecipe['ORE'].needed);
}

function createReactionDB(inputArray) {
	inputArray.forEach((line) => {
		let formula = line.trim().split('=>');
		let recipe = formula[0]
			.trim()
			.split(',')
			.map((x) => {
				return x.trim();
			});
		let result = formula[1]
			.trim()
			.split(',')
			.map((x) => {
				return x.trim();
			});
		let baseIngredient = 0;

		result.forEach((resultElement) => {
			let elementLine = resultElement.split(' ').map((x) => {
				return x.trim();
			});
			if (reactions[elementLine[1]]) {
				reactions[elementLine[1]].amount += +elementLine[0];
			} else {
				reactions[elementLine[1]] = {
					amount: +elementLine[0],
					recipe: [],
					base: baseIngredient
				};
			}
		});

		recipe.forEach((recipeElement) => {
			let recipeLine = recipeElement.split(' ').map((x) => {
				return x.trim();
			});

			result.forEach((resultElement) => {
				let elementLine = resultElement.split(' ').map((x) => {
					return x.trim();
				});
				if (recipeLine[1] === 'ORE') {
					reactions[elementLine[1]].base = 1;
				}
				if (reactions[elementLine[1]]) {
					reactions[elementLine[1]].amount = +elementLine[0];
					reactions[elementLine[1]].recipe.push({ amount: +recipeLine[0], element: recipeLine[1] });
				} else {
					reactions[elementLine[1]] = {
						amount: +elementLine[0],
						recipe: [{ amount: +recipeLine[0], element: recipeLine[1] }]
					};
				}
			});
		});
	});
}

function calculateFuelRecipe() {
	let fuelRecipe = [...reactions['FUEL'].recipe];
	let elementsNeeded = {};

	elementsNeeded['ORE'] = { needed: 0, produced: 0 };

	while (fuelRecipe.length > 0) {
		let ingredient = fuelRecipe.pop();
		let neededElement = {
			amount: ingredient.amount,
			produced: 0,
			delta: -ingredient.amount
		};
		elementsNeeded[ingredient.element] = neededElement;
	}

	let production = true;

	while (production) {
		let productionLine = {};
		for (const key in elementsNeeded) {
			if (key !== 'ORE' && elementsNeeded[key].delta < 0) {
				productionLine[key] = elementsNeeded[key];
			}
		}

		production = Object.keys(productionLine).length > 0;

		if (production) {
			for (const key in productionLine) {
				let toProduce = reactions[key];
				elementsNeeded[key].produced += toProduce.amount;
				elementsNeeded[key].delta += toProduce.amount;
				let productionRecipe = [...toProduce.recipe];
				while (productionRecipe.length > 0) {
					let ingredient = productionRecipe.pop();
					if (ingredient.element !== 'ORE') {
						if (elementsNeeded[ingredient.element]) {
							elementsNeeded[ingredient.element].amount += ingredient.amount;
							elementsNeeded[ingredient.element].delta -= ingredient.amount;
						} else {
							let neededElement = {
								amount: ingredient.amount,
								produced: 0,
								delta: -ingredient.amount
							};
							elementsNeeded[ingredient.element] = neededElement;
						}
					} else {
						elementsNeeded['ORE'].needed += ingredient.amount;
					}
				}
			}
		}
	}

	return elementsNeeded;
}

function getElementAmount(element) {}
