"use strict";

function group_dice(diceString) {
	//MapTool.chat.broadcast(diceString);

	const dieRegexp = /[+-]?[0-9]*d[0-9]+/g;
	const flatRegexp = /(?<!d)[+-]?[0-9]+(?![0-9]*d)/g;

	let dice = diceString.match(dieRegexp);
	let flats = diceString.match(flatRegexp);
	if (!isNaN(diceString)) {
		flats = [diceString];
	}

	//MapTool.chat.broadcast(JSON.stringify(dice));
	//MapTool.chat.broadcast(JSON.stringify(flats));

	let diceCounts = {};

	for (var d in dice) {
		let die = dice[d];
		let num = Number(die.split("d")[0]);
		//MapTool.chat.broadcast(JSON.stringify(die));
		let size = die.split("d")[1];
		if (!(size in diceCounts)) {
			diceCounts[size] = Number(num)
		} else {
			diceCounts[size] += Number(num);
		}
	}

	//MapTool.chat.broadcast(JSON.stringify(diceCounts));

	let resultString = "";

	for (var d in diceCounts) {
		resultString = resultString + diceCounts[d] + "d" + d;
	}

	let totalFlat = 0;
	for (var c in flats) {
		totalFlat += Number(flats[c]);
	}

	if (totalFlat != 0) {
		if (resultString != "") {
			resultString += "+";
		}
		resultString += String(totalFlat);
	}

	resultString = resultString.replaceAll("++", "+").replaceAll("+-", "-").replaceAll("+", " + ").replaceAll("-", " - ");

	//MapTool.chat.broadcast(resultString);
	return resultString;
}

MTScript.registerMacro("ca.pf2e.group_dice", group_dice);