"use strict";

function calculate_ac(tokenID) {
	let token = MapTool.tokens.getTokenByID(tokenID);

	//let base_ac = Number(token.getProperty("AC"));
	let base_ac = 10;

	let foundryActor = JSON.parse(token.getProperty("foundryActor"));
	if ("simple" in foundryActor && foundryActor.simple) {
		base_ac = Number(token.getProperty("ac"));
	}

	if (get_token_property_type(token) == "PF2E_Hazard") {
		return Number(token.getProperty("ac"));
	}

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
		armorBonus = eqArmor.system.acBonus + eqArmor.system.runes.potency;
		dexCap = Math.min(eqArmor.system.dexCap, dexCap);
		armorProfType = eqArmor.system.category;
		if ("otherEffects" in bonuses && eqArmor.baseItem in bonuses.otherEffects) {
			let armorChange = bonuses.otherEffects[eqArmor.baseItem];
			if (armorChange.mode == "add") {
				armorBonus += armorChange.value;
			}
		}
	}

	let shieldRaised = get_actor_data(token, "system.attributes.shield.raised");

	try {
		if (eqShield != null && eqShield != "null" && ((shieldRaised != null && shieldRaised) || eqShield.raised)) {
			if ("system" in eqShield && "ac" in eqShield.system) {
				shieldBonus = eqShield.system.ac;
			} else if ("system" in eqShield && "acBonus" in eqShield.system) {
				shieldBonus = eqShield.system.acBonus;
			} else if ("ac" in eqShield) {
				shieldBonus = eqShield.ac;
			}
		}
	} catch (e) {
		MapTool.chat.broadcast("Error in calculate_ac during shieldBonus Check");
		MapTool.chat.broadcast("eqShield: " + JSON.stringify(eqShield));
		MapTool.chat.broadcast("" + e + "\n" + e.stack);
		return;
	}

	for (var p in profs) {
		if (armorProfType == profs[p].name.toLowerCase()) {
			profBonus = profs[p].bonus;
			break;
		}
	}

	let totalAC = base_ac;
	if (get_token_type(token) == "PC") {
		if (!("simple" in foundryActor && foundryActor.simple)) {
			dex_bonus = Math.max(0, Math.min(dex_bonus, dexCap));
		} else {
			dex_bonus = 0;
		}

		bonuses = Math.max(bonuses.bonuses.circumstance, shieldBonus) + bonuses.bonuses.status + Math.max(bonuses.bonuses.item, armorBonus) + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item + bonuses.bonuses.proficiency;
		//MapTool.chat.broadcast(String(base_ac) + "+"+String(bonuses) + "+" + String(dex_bonus) + "+"+String(profBonus));
		totalAC = (base_ac + bonuses + dex_bonus + profBonus);
	} else {
		base_ac = Number(token.getProperty("AC"));

		bonuses = Math.max(bonuses.bonuses.circumstance, shieldBonus) + bonuses.bonuses.status + bonuses.bonuses.item + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item + bonuses.bonuses.proficiency;

		totalAC = (base_ac + bonuses);
	}
	return totalAC;
}

MTScript.registerMacro("ca.pf2e.calculate_ac", calculate_ac);