"use strict";

function display_save_bonuses(tokenID){
	let token = MapTool.tokens.getTokenByID(tokenID);
	let fortitude = Number(token.getProperty("fortitude"));
	let will = Number(token.getProperty("will"));
	let reflex = Number(token.getProperty("reflex"));
	//MapTool.chat.broadcast(String(token));
	
	let fortitudeBonus = calculate_bonus(tokenID,["fortitude","saving-throw"], false);
	fortitudeBonus = fortitudeBonus.bonuses.circumstance + fortitudeBonus.bonuses.status + fortitudeBonus.bonuses.item + fortitudeBonus.maluses.circumstance + fortitudeBonus.maluses.status + fortitudeBonus.maluses.item;
	
	let reflexBonus = calculate_bonus(tokenID,["reflex","saving-throw"], false);
	reflexBonus = reflexBonus.bonuses.circumstance + reflexBonus.bonuses.status + reflexBonus.bonuses.item + reflexBonus.maluses.circumstance + reflexBonus.maluses.status + reflexBonus.maluses.item;
	
	let willBonus = calculate_bonus(tokenID,["will","saving-throw"], false);
	willBonus = willBonus.bonuses.circumstance + willBonus.bonuses.status + willBonus.bonuses.item + willBonus.maluses.circumstance + willBonus.maluses.status + willBonus.maluses.item;
	
	let returnString = "Fort: " + pos_neg_sign(fortitude + fortitudeBonus) + ", Ref: " + pos_neg_sign(reflex + reflexBonus) + ", Will: " + pos_neg_sign(will + willBonus);
	//MapTool.chat.broadcast(returnString)
	return returnString;
}

MTScript.registerMacro("ca.pf2e.display_save_bonuses", display_save_bonuses);