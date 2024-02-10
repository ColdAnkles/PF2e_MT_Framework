"use strict";

function trait_inheritance(trait) {
	let returnData = { "immunities": [], "resistances": [], "weaknesses": [] };
	if (trait == "mindless") {
		returnData.immunities = returnData.immunities.concat([{ "type": "mental" }]);
	} else if (trait == "construct") {
		returnData.immunities = returnData.immunities.concat([{ "type": "bleed" }, { "type": "death effects" }, { "type": "disease" }, { "type": "healing" }, { "type": "necromancy" }, { "type": "nonlethal attacks" }, { "type": "poison" }, { "type": "doomed" }, { "type": "drained" }, { "type": "fatigued" }, { "type": "paralyzed" }, { "type": "sickened" }, { "type": "unconscious" }])
	}

	return returnData;
}


MTScript.registerMacro("ca.pf2e.trait_inheritance", trait_inheritance);