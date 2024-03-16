"use strict";

function display_save_bonuses(tokenID) {
	let token = MapTool.tokens.getTokenByID(tokenID);
	let fortitude = Number(token.getProperty("fortitude"));
	let will = Number(token.getProperty("will"));
	let reflex = Number(token.getProperty("reflex"));
	let eqArmor = get_equipped_armor(token);
	//MapTool.chat.broadcast(String(token));

	let armorResilient = 0;
	if (eqArmor != null) {
		armorResilient = eqArmor.runes.resilient;
	}

	let fortitudeBonus = calculate_bonus(tokenID, ["fortitude", "saving-throw"]);
	//MapTool.chat.broadcast(JSON.stringify(fortitudeBonus));
	fortitudeBonus = fortitudeBonus.bonuses.circumstance + fortitudeBonus.bonuses.status + Math.max(fortitudeBonus.bonuses.item, armorResilient) + fortitudeBonus.maluses.circumstance + fortitudeBonus.maluses.status + fortitudeBonus.maluses.item + fortitudeBonus.bonuses.proficiency;

	let reflexBonus = calculate_bonus(tokenID, ["reflex", "saving-throw"]);
	reflexBonus = reflexBonus.bonuses.circumstance + reflexBonus.bonuses.status + Math.max(reflexBonus.bonuses.item, armorResilient) + reflexBonus.maluses.circumstance + reflexBonus.maluses.status + reflexBonus.maluses.item + reflexBonus.bonuses.proficiency;

	let willBonus = calculate_bonus(tokenID, ["will", "saving-throw"]);
	willBonus = willBonus.bonuses.circumstance + willBonus.bonuses.status + Math.max(willBonus.bonuses.item, armorResilient) + willBonus.maluses.circumstance + willBonus.maluses.status + willBonus.maluses.item + willBonus.bonuses.proficiency;

	let returnString = "Fort: " + pos_neg_sign(fortitude + fortitudeBonus) + ", Ref: " + pos_neg_sign(reflex + reflexBonus) + ", Will: " + pos_neg_sign(will + willBonus);
	//MapTool.chat.broadcast(returnString)
	return returnString;
}

MTScript.registerMacro("ca.pf2e.display_save_bonuses", display_save_bonuses);