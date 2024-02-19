"use strict";

function calculate_ac(tokenID) {
	let token = MapTool.tokens.getTokenByID(tokenID);
	//let base_ac = Number(token.getProperty("AC"));
	let base_ac = 10;
	let dex_bonus = Number(token.getProperty("dex"));
	let bonuses = calculate_bonus(tokenID, "ac");
	let eqArmor = get_equipped_armor(token);
	let profs = JSON.parse(token.getProperty("proficiencies"));
	//MapTool.chat.broadcast(JSON.stringify(bonuses));
	//MapTool.chat.broadcast(JSON.stringify(eqArmor));

	let armorBonus = 0;
	let dexCap = 999;


	if("otherEffects" in bonuses && "DexterityModifierCap" in bonuses.otherEffects){
		dexCap = bonuses.otherEffects.DexterityModifierCap;
	}

	let profBonus = 0

	if(eqArmor!=null){
		armorBonus = eqArmor.acBonus + eqArmor.runes.potency;
		dexCap = Math.min(eqArmor.dexCap, dexCap);
	}else{
		for(var p in profs){
			if("UNARMORED" == profs[p].name.toUpperCase()){
				profBonus = profs[p].bonus;
				break;
			}
		}
	}

	dex_bonus = Math.max(0, Math.min(dex_bonus, dexCap));

	bonuses = bonuses.bonuses.circumstance + bonuses.bonuses.status + Math.max(bonuses.bonuses.item, armorBonus) + bonuses.maluses.circumstance + bonuses.maluses.status + bonuses.maluses.item + bonuses.bonuses.proficiency;
	let totalAC = (base_ac + bonuses + dex_bonus + profBonus);
	return totalAC;
}

MTScript.registerMacro("ca.pf2e.calculate_ac", calculate_ac);