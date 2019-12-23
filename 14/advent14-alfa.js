// GENERAL VARS
let data = '';
let dataFile = 'input.txt';
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
	let step2 = calculateFuelRun();
	console.log('STEP2: '+step2);
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
					base: baseIngredient,
					oreCost: 0
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
					reactions[elementLine[1]].oreCost += +recipeLine[0];
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

function calculateFuelAmount(recipe) {
	const OreNeeded = recipe['ORE'].needed;
	let restAmount = oreInput - OreNeeded;

	let counter = 0;

	let fuelRun = {};

	for (const key in recipe) {
		if (key !== 'ORE') {
			fuelRun[key] = {
				amount: recipe[key].amount,
				produced: recipe[key].produced,
				delta: recipe[key].delta
			};
		}
	}

	while (restAmount > OreNeeded && counter < 100000000) {
		counter++;

		for (const element in fuelRun) {
			let amount = recipe[element].amount;
			let produced = recipe[element].produced;
			let newDelta = fuelRun[element].delta - amount;

			if (newDelta < 0) {
				fuelRun[element].amount += amount;
				fuelRun[element].produced += produced;
				newDelta += produced;
				if (reactions[element].base === 1) {
					let elementCost = reactions[element].oreCost * (produced / reactions[element].amount);
					restAmount -= elementCost;
				}
			}

			fuelRun[element].delta = newDelta;
		}
	}

	console.log('STEP2: ' + counter);
	console.log('STEP2rest: ' + restAmount);
}

function calculateOreCost(recipe) {
	let counter = 0;
	let fuelRun = {};

	for (const key in recipe) {
		if (key !== 'ORE') {
			fuelRun[key] = {
				amount: recipe[key].amount,
				produced: recipe[key].produced,
				delta: recipe[key].delta
			};
		}
	}

	for (const key in fuelRun) {
		const element = fuelRun[key];

		if (key !== 'ORE' && reactions[key].base === 1)
		{
			element.oreCost = calculateElementCost(key, fuelRun[key].produced);
		}
	}

	console.log(fuelRun);
}


function calculateElementCost(element, produced)
{
	let recipe = reactions[element].recipe;
	let elemAmount = reactions[element].amount;
	let cost = 0;
	recipe.forEach(ingredient => {
		let amount = ingredient.amount;

		cost += (produced / elemAmount) * amount;
	});

	return cost;
}

function calculateFuelRun() {
	let fuelRecipe = [...reactions['FUEL'].recipe];
	let elementsNeeded = {};
	let oreCount = 0;
	let runCounter = 0;

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
			if (elementsNeeded[key].delta < 0) {
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
						oreCount += ingredient.amount;
					}
				}
			}
		}
		else
		{
			if (oreCount <= oreInput)
			{
				production = true;
				runCounter++;

				fuelRecipe = [...reactions['FUEL'].recipe];

				while (fuelRecipe.length > 0) {
					let ingredient = fuelRecipe.pop();
					let neededElement = {
						amount: ingredient.amount,
						produced: 0,
						delta: elementsNeeded[ingredient.element].delta-ingredient.amount
					};
					elementsNeeded[ingredient.element] = neededElement;
				}

				if (runCounter % 100000 === 0)
				{
					console.log(elementsNeeded);
					console.log(oreCount);
					console.log('RUN: '+runCounter);
				}

				if (runCounter > 10000000)
				{
					production = false;
				}
			}
			else
			{
				runCounter;
			}
		}
	}

	return [runCounter, oreCount];
}