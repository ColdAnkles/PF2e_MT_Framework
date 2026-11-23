"use strict";

function parse_damage(damageString, additionalData = { "rollDice": false, "isPC": false }) {
	let damageData = damageString.match(/@Damage\[(.*)\]/)[1].split(/,(?![^\[]*\])/);
	let addDamage = 0;
	let pcReturnStrings = [];
	let gmReturnStrings = [];

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
		var matchDamage = damage.match(/([^[\]]*)\[(.*)\](\|options:)?(.*)?/)
		var dice = matchDamage[1];
		var types = matchDamage[2].split(",");
		var options = null;
		if (matchDamage.length >= 4 && matchDamage[4] != null) {
			options = matchDamage[4];
			options = options.replaceAll("-damage", "");
		}
		if ((additionalData.rollDice && !types.includes("persistent")) || !dice.includes("d")) {
			if (dice.length > 0) {
				let finalDice = group_dice(dice + "+" + String(addDamage));
				let rolledDice = roll_dice(finalDice);
				if (!dice.includes("d")) {
					dice = dice.replace(dice, String(rolledDice));
					pcReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
					gmReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
				} else {
					if (!additionalData.isPC) {
						var temp = dice.replace(dice, finalDice + " (" + String(rolledDice) + ")");
						pcReturnStrings.push(finalDice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
						gmReturnStrings.push(temp + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
					} else if (additionalData.isPC) {
						dice = dice.replace(dice, finalDice + " (" + String(rolledDice) + ")");
						pcReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
						gmReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
					} else {
						pcReturnStrings.push(finalDice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
						gmReturnStrings.push(finalDice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
					}
				}
			} else {
				dice = group_dice(dice + "+" + String(addDamage));
				pcReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
				gmReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
			}
		} else {
			dice = group_dice(dice + "+" + String(addDamage));
			pcReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
			gmReturnStrings.push(dice + " " + types.join(", ") + ((options != null) ? " (" + options + ")" : ""));
		}
	}
	return { "pc": pcReturnStrings.join(" and "), "gm": gmReturnStrings.join(" and ") };
}