"use strict";

function display_active_effects(token) {
	if (typeof (token) == "string") {
		token = MapTool.tokens.getTokenByID(token);
	}
	let outputString = ""

	let tokenEffects = Object.assign({}, JSON.parse(token.getProperty("activeEffects")), JSON.parse(token.getProperty("specialEffects")));

	var sorted = [];
	for (var key in tokenEffects) {
		sorted[sorted.length] = key;
	}
	sorted.sort();

	let counter = 0;
	for (var c in sorted) {
		let separator = ", ";
		if ((counter + 1) % 3 == 0) {
			separator = " \n";
		}
		outputString += sorted[c].replaceAll("Spell Effect: ", "").replaceAll("Effect: ", "");
		outputString += separator;
		counter += 1;
	}

	let actorData = JSON.parse(token.getProperty("foundryActor"));
	let activeRegen = false;
	if ("regen" in actorData) {
		activeRegen = actorData.regen;
	}
	if (activeRegen) {
		outputString += "Regenerating, ";
	}

	outputString = outputString.substring(0, outputString.length - 2);

	return outputString;
}

MTScript.registerMacro("ca.pf2e.display_active_effects", display_active_effects);