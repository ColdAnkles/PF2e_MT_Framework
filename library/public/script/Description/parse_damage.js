"use strict";

function parse_damage(damageString, additionalData = { "rollDice": false, "gm": false, "replaceGMRolls": true, "isPC": false }) {
	let damageData = damageString.match(/@Damage\[(.*)\]/)[1].split(/,(?![^\[]*\])/);
	let parsed = parse_foundry_strings(damageString);
	let addDamage = 0;
	let returnStrings = [];

	if (additionalData.variant == "elite" && "action" in additionalData && (additionalData.action.system.category == "offensive" || additionalData.action.type == "spell")) {
		addDamage = 2;
	} else if (additionalData.variant == "weak" && "action" in additionalData && (additionalData.action.system.category == "offensive" || additionalData.action.type == "spell")) {
		addDamage = -2;
	}
	if ("action" in additionalData && (additionalData.action.system.description.value.toLowerCase().includes("recharge") || additionalData.action.type == "spell")) {
		addDamage = addDamage * 2;
	}
	for (var d in damageData) {
		var damage = damageData[d];
		var dice = damage.match(/([^[\]]*)\[(.*)\]/)[1];
		var types = damage.match(/([^[\]]*)\[(.*)\]/)[2].split(",");
		if ((additionalData.rollDice && !types.includes("persistent")) || !dice.includes("d")) {
			if (dice.length > 0) {
				let finalDice = group_dice(dice + "+" + String(addDamage));
				let rolledDice = roll_dice(finalDice);
				if (!dice.includes("d")) {
					dice = dice.replace(dice, String(rolledDice));
				} else {
					if (additionalData.gm || additionalData.isPC) {
						dice = dice.replace(dice, finalDice + " (" + String(rolledDice) + ")");
					} else {
						dice = dice.replace(dice, finalDice);
					}
				}
				if (parsed.braceContents == null) {
					parsed.braceContents = "";
				}
				returnStrings.push(dice + " " + types.join(", "));
			} else {
				dice = group_dice(dice + "+" + String(addDamage));
				returnStrings.push(dice + " " + types.join(", "));
			}
		} else {
			dice = group_dice(dice + "+" + String(addDamage));
			returnStrings.push(dice + " " + types.join(", "));
		}
	}
	return returnStrings.join(" and ");
}