"use strict";

function calculate_ac(tokenID) {
	let token = MapTool.tokens.getTokenByID(tokenID);
	//let base_ac = Number(token.getProperty("AC"));
	let base_ac = 10;
	let dex_bonus = Number(token.getProperty("dex"));
	let bonuses = calculate_bonus(tokenID, "ac");
	let eqArmor = get_equipped_armor(token);
	let eqShield = get_equipped_shield(token);
	let profs = JSON.parse(token.getProperty("proficiencies"));
	//MapTool.chat.broadcast(JSON.stringify(bonuses));
	//MapTool.chat.broadcast(JSON.stringify(eqArmor));
	//MapTool.chat.broadcast(JSON.stringify(eqShield));

	let armorBonus = 0;
	let dexCap = 999;
	let shieldBonus = 0;


	if ("otherEffects" in bonuses && "DexterityModifierCap" in bonuses.otherEffects) {
		dexCap = bonuses.otherEffects.DexterityModifierCap;
	}

	let profBonus = 0;
	let armorProfType = "unarmored";

	if (eqArmor != null) {
		armorBonus = eqArmor.acBonus + eqArmor.runes.potency;
		dexCap = Math.min(eqArmor.dexCap, dexCap);
		armorProfType = eqArmor.armorType;
		if ("otherEffects" in bonuses && eqArmor.baseItem in bonuses.otherEffects) {
			let armorChange = bonuses.otherEffects[eqArmor.baseItem];
			if (armorChange.mode == "add") {
				armorBonus += armorChange.value;
			}
		}
	}

	if (eqShield != null && eqShield != "null") {
		shieldBonus = eqShield.ac;
	}

	for (var p in profs) {
		if (armorProfType == profs[p].name.toLowerCase()) {
			profBonus = profs[p].bonus;
			break;
		}
	}


	dex_bonus = Math.max(0, Math.min(dex_bonus, dexCap));

	bonuses = Math.max(bonuses.bonuses.circumstance, shieldBonus) + bonuses.bonuses.status + Math.max(bonuses.bonuses.item, armorBonus) + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item + bonuses.bonuses.proficiency;
	//MapTool.chat.broadcast(String(base_ac) + "+"+String(bonuses) + "+" + String(dex_bonus) + "+"+String(profBonus));
	let totalAC = (base_ac + bonuses + dex_bonus + profBonus);
	return totalAC;
}

MTScript.registerMacro("ca.pf2e.calculate_ac", calculate_ac);